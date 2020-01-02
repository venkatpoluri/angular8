import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
//import { MyErrorStateMatcher } from '../../../shared/services/error-match/error-match.component';
import { FormControl, Validators, FormGroupDirective, NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { CcapiService } from '../../../shared/services/ccapi.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css']
})

export class CreateUserDialogComponent implements OnInit {
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
  public loginRole: any;
  public authtypelist: any[] = [];
  public masters: any;
  public servicegrouplist: any[] = [];
  public selectedservicegroups: any[] = [];
  public rolesList: any[] = [];
  public buunits: any[] = [];
  public buadmin: boolean = false;
  public isbuadmin: boolean = false;
  public OperatorsList: any[] = [];
  public usp: any;
  public userobj: any;
  public mode: string = 'insert';
  public title: string = "ADD USER";
  public servicegroups: any[] = [];
  public userservicegroups: any;
  public userid: number = 0;
  constructor(private ccapi: CcapiService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<CreateUserDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    dialogRef.disableClose = true;
    this.authtypelist = [{ istatus: false, authloginid: "", authtype: "ADFS", oldauthloginid: '' }, { istatus: false, authloginid: "", authtype: "LDAP", oldauthloginid: '' }];
    if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
      this.masters = JSON.parse(sessionStorage.getItem("srvmasters"));
      this.LoadServiceGroups();
    }
    else {
      this.ccapi.postData("master/masters", {}).subscribe((resp: any) => {
        if (resp.code == "200") {
          this.masters = resp.data;
          sessionStorage.setItem("srvmasters", JSON.stringify(this.masters));
          this.LoadServiceGroups();
        }
      });
    }
    this.userobj = {
      uname: "",
      uusertype: "",
      status: "1",
      udepartment: "",
      uemail: "",
      umobileno: "",
      udesignation: "",
      usp: "",
      operators: "",
      uloginid: "",
      sps: "",
      loginid: "",
      selectedservicegroups: ""
    };
    this.rolesList = data.roles;
    this.buunits = data.buunits;
    this.mode = data.mode;
    if (data.user != undefined && data.user != null) {
      this.userid=data.userid
      this.title = "UPDATE USER :" + data.user[0].username.toUpperCase();
      this.GetUserDetails(data.user);
    }
  }
  GetUserDetails(userdet) {
    this.userobj.uname = userdet[0].username;
    this.userobj.uemail = userdet[0].emailid;
    this.userobj.uloginid = userdet[0].loginid;
    this.userobj.umobileno = userdet[0].mobileno;
    this.userobj.uusertype = userdet[0].userroleid;
    this.userobj.udisplayname = userdet[0].username;
    this.userobj.buname = userdet[0].buname;
    this.userobj.status = userdet[0].status;
    this.userobj.prevStatus = userdet[0].status;
    if (userdet[0].department != undefined)
      this.userobj.udepartment = userdet[0].department;
    if (userdet[0].designation != undefined)
      this.userobj.udesignation = userdet[0].designation;;
    this.userobj.languageid = userdet[0].lang;
    if (userdet[0].authtype == "0")
      userdet[0].authtype = "1";
    
    if (this.userobj.uusertype == 1010013 || this.userobj.uusertype == 1010014) {
      $("#divServGroup").show();
      this.servicegroups = (userdet[0].servicegroup != undefined && userdet[0].servicegroup != null) ? userdet[0].servicegroup.split(',') : [];
      this.userservicegroups = userdet[0].servicegroup;
      //    $scope.resetselect2('ddlservicegroups', $scope.userdet[0].servicegroup.split(','));
    }
    else {
      $("#divServGroup").hide();
    }

    this.userobj.selectedservicegroups = [];

    if (userdet[0].servicegroup != undefined && userdet[0].servicegroup != null) {
      this.userservicegroups = userdet[0].servicegroup;
      var _userservicegroups = userdet[0].servicegroup.split(',');
      this.servicegroups = _userservicegroups;
      for (var i = 0; i < _userservicegroups.length; i++) {
        for (var j = 0; j < this.servicegrouplist.length; j++) {
          var _id = _userservicegroups[i];
          var _data2 = this.servicegrouplist[j];
          if (_id == _data2.id) {
            this.userobj.selectedservicegroups.push(this.servicegrouplist[j].id);
          }
        }
      }
    }
    this.userobj.usp = userdet[0].parentid;

    for (var i = 0; i < this.authtypelist.length; i++) {
      var _x = this.authtypelist[i];
      if (userdet.length > 1) {
        for (var j = 1; j < userdet.length; j++) {
          if (userdet[j] != undefined && userdet[j].authtype != null && userdet[j].authtype != undefined && userdet[j].authtype.length > 2) {
            if (userdet[j].authtype == _x.authtype && userdet[j].istatus == "1") {
              //  $("#chk_" + _x.authtype).prop("checked", "true");
              this.authtypelist[i].istatus = true;
              if (userdet[j].authloginid != undefined) {
                this.authtypelist[i].authloginid = userdet[j].authloginid;
                this.authtypelist[i].oldauthloginid = userdet[j].authloginid;
              }
            }
          }
        }
      }
    }
  }

  ngOnInit() {
   this.loginRole = this.ccapi.getRole();
   if (this.loginRole == '1010005') {
      this.buadmin = true;
    }
  
  }
  compareWithFunc(a, b) {
    return a === b;
  }
  check(event: KeyboardEvent) {
    // 31 and below are control keys, don't block them.
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }
  submitUser(): void {
    if (this.userobj.uname == undefined || this.userobj.uname == "") {
      this.ccapi.openDialog('error', "Please enter name");
      return;
    }
    if (this.userobj.uemail == undefined || this.userobj.uemail == "") {
      this.ccapi.openDialog('error', "Please enter valid user emailid");
      return;
    }
    if (this.userobj.umobileno == undefined || this.userobj.umobileno == "") {
      this.ccapi.openDialog('error', "Please enter mobileno");
      return;
    }
    if (this.userobj.umobileno.length < 9 || this.userobj.umobileno.length > 13) {
      this.ccapi.openDialog('error', "Please enter valid mobileno");
      return;
    }
    if (this.userobj.uloginid == undefined || this.userobj.uloginid == "") {
      this.ccapi.openDialog('error', "Please enter loginid.");
      return;
    }
    if (this.userobj.uusertype == undefined || this.userobj.uusertype == "") {
      this.ccapi.openDialog('error', "Please select usertype");
      return;
    }
    if (this.userobj.usp == undefined || this.userobj.usp == '' || this.userobj.usp == '0') {
      if (this.userobj.uusertype == "1010003")
        this.userobj.usp = '0';
    }
    if (this.userobj.status == undefined || this.userobj.status == '') {
      this.ccapi.openDialog('error', "Please select status");
      return;
    }

    var _authtypelist = "";
    for (var i = 0; i < this.authtypelist.length; i++) {
      if (this.authtypelist[i].istatus == "1" || this.authtypelist[i].istatus == true) {
        if (this.authtypelist[i].authloginid == null || this.authtypelist[i].authloginid == undefined || this.authtypelist[i].authloginid.length < 2) {
          this.ccapi.openDialog('error', "Please enter loginId for" + this.authtypelist[i].authtype);
          return;
        }
        _authtypelist += this.authtypelist[i].authtype + "~" + this.authtypelist[i].authloginid + "~" + this.authtypelist[i].oldauthloginid + "~" + this.authtypelist[i].istatus + ",";
      }
    }
    var tempservicegroups = "";
    if (this.userobj.selectedservicegroups != undefined && this.userobj.selectedservicegroups != null && this.userobj.selectedservicegroups.length > 0) {
      var _arr = [];
      for (i = 0; i < this.userobj.selectedservicegroups.length; i++) {
        var _val = this.userobj.selectedservicegroups[i];
        _arr.push(_val);
      }
      tempservicegroups = _arr.toString();
    }
    if (this.loginRole == '1010002') {
      this.userobj.usp = this.ccapi.getUserId();
    }
    var url = "";
    if (this.mode == 'insert') {
      url = 'user/createuser'
    }
    else {
      url ="user/updateuser"
    }
    var postData = {
      userid: this.userid, name: this.userobj.uname, status: this.userobj.status, emailid: this.userobj.uemail, loginid: this.userobj.uloginid, mobileno: this.userobj.umobileno,
      userrole: parseInt(this.userobj.uusertype), displayname: this.userobj.udisplayname, department: this.userobj.udepartment, designation: this.userobj.udesignation,
      sendemail: "", sps: this.userobj.usp, lang: "", defaultkeys: "", operatorid: this.userobj.operators, authtype: "1",
      servicegroup: tempservicegroups, userservicegroups: this.userservicegroups, issubaccounts: 0, subacccnt: 0, useraccesstypes: _authtypelist
    };
    this.ccapi.postData(url, postData).subscribe((res: any) => {
      if (res.code == "200" && res.status == "success") {
        this.ccapi.openDialog('success', res.message);
        this.dialogRef.close();
      }
      else {
        this.ccapi.openDialog('error', res.message);
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
  LoadServiceGroups() {
    if (this.masters.hasOwnProperty("servicegroup")) {
      this.servicegrouplist = this.masters.servicegroup;
    }
    this.selectedservicegroups = [];
  }

  ChangeAType(itm) {
    if (itm.status == true)
      itm.status = false;
    else
      itm.status = true;
  }
  GetSps() {
    // $scope.prevUserRole = this.uusertype;
    this.LoadServiceGroups();
    // $scope.uusertype = $scope.usertype;
    if (this.userobj.uusertype == "1010003" || this.userobj.uusertype == "1010004" || this.userobj.uusertype == "1010005" || this.userobj.uusertype == "1010010"
      || this.userobj.uusertype == "1010012" || this.userobj.uusertype == "1010013" || this.userobj.uusertype == "1010014") {
      $("#divsps").show();
      if (this.loginRole == "1010005") {
        this.usp = $.grep(this.buunits, function (item) {
          return item.name == this.ccapi.getUserName();
        })[0].id;
        this.buadmin = true;
      }
    }
    else {
      $("#divsps").hide();
    }

    if (this.userobj.uusertype == "1010002" || this.userobj.uusertype == "1010010"
      || this.userobj.uusertype == "1010003" || this.userobj.uusertype == "1010013" || this.userobj.uusertype == "1010014")
      $("#divServGroup").show();
    else
      $("#divServGroup").hide();

    //if (this.userobj.uusertype == "1010002" || this.userobj.uusertype == "1010005") {
    //  this.LoadServiceGroups();
    //  $("#divaccounts").show();
    //}
    //else {
    //  $("#divaccounts").hide();
    //}

    if (this.userobj.uusertype == "1010002") {
      this.isbuadmin = true;
      this.getoperators();
    }
    else
      this.isbuadmin = false;
  }
  getoperators() {
    this.ccapi.postData("master/operators", {}).subscribe((resp: any) => {
      if (resp.data.code == "200") {
        this.OperatorsList = resp.data.data;
      }
    });
  }

}
