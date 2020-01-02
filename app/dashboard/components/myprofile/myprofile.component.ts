import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CcapiService } from "../../../shared/services/ccapi.service";
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {
  public userinfo: any;
  public pwdinfo: any;
  public showuserInfo: boolean = true;
  public showpwdInfo: boolean = false;
  public pwdPolicy: string;
  public langlist: any[] = [];
  public enableedit: boolean = true;
  public getrole: any = "";
  constructor(private router: Router, private activeRoute: ActivatedRoute, private ccapi: CcapiService, private dialog: MatDialog) {
    this.userinfo = {
      userid: 0,
      uname: "",
      uemail: "",
      uloginid: "",
      umobileno: "",
      uusertype: "",
      udisplayname: "",
      udepartment: "",
      udesignation: "",
      languageid: "",
      urole: "",
      authtype: "",
      dtlastlogin:"",
    };
    this.pwdinfo = {
      oldpassword: "",
      newpassword: "",
      rnewpassword: ""
    }
  }

  ngOnInit() {
    this.getrole = this.ccapi.getRole();
    this.GetUserDetails();
    this.PasswordPolicy();
  }
  displayTab(tab) {
    if (tab == 'info') {
      this.showuserInfo = true;
      this.showpwdInfo = false;
    }
    else if (tab == 'pwd') {
      this.showuserInfo = false;
      this.showpwdInfo = true;
    }
  }
  GetUserDetails() {
    this.ccapi.postData("user/getuserdetailsbyid", {}).subscribe((response: any) => {
      if (response.code == "200") {
        var userdet = response.data;
        this.loadLanguages();
        if (userdet != undefined) {
          this.userinfo.userid = userdet[0].userid;
          this.userinfo.uname = userdet[0].username;
          this.userinfo.uemail = userdet[0].emailid;
          this.userinfo.uloginid = userdet[0].loginid;
          this.userinfo.umobileno = userdet[0].mobileno;
          this.userinfo.uusertype = userdet[0].userroleid;
          this.userinfo.dtlastlogin = userdet[0].dtlastlogin;
          this.userinfo.udisplayname = userdet[0].username;
          if (userdet[0].department != undefined)
            this.userinfo.udepartment = userdet[0].department;
          if (userdet[0].designation != undefined)
            this.userinfo.udesignation = userdet[0].designation;
          this.userinfo.languageid = userdet[0].lang;
          this.userinfo.urole = userdet[0].userrole;
          this.userinfo.authtype = userdet[0].authtype;
        }
        console.log(this.userinfo);
        if (this.getrole == "1010012" || this.getrole == "1010005") {
          //$scope.permission = resp.data.permission;
          //if ($scope.permission.edit == 0) {
          //  $scope.enableedit = false;
          //}
        }
      }
      else {
        if (response.code != "401") {
          this.ccapi.openDialog('error', "Dear User, Currently we cannot process your request");
          return;
        }
      }
    });
  }
  PasswordPolicy() {
    this.ccapi.postData('login/GetPasswordPolicy', {}).subscribe((response: any) => {
      this.pwdPolicy = "";
      var policy = response.data;
      if (policy.MaxCharsInName != undefined && policy.MaxCharsInName > 0) {
        this.pwdPolicy += "<p>Characters in LoginID should not be present in Password.</p>";
      }
      this.pwdPolicy += "<p>Password should contain atleast " + policy.MinLength + " characters.</p>";
      this.pwdPolicy += "<p>It has not been used in the past " + policy.RestrictNoOfPrevMatches + " Passwords.</p>";
      this.pwdPolicy += "<dl><dt> It Contains the following character groups - </dt>";
      if (policy.IsUpperCaseRequired == "True") {
        this.pwdPolicy += "<dd>English Uppercase Characters [A-Z], </dd>";
      }
      if (policy.IsLowerCaseRequired == "True") {
        this.pwdPolicy += "<dd>English Lower case Characters [a-z],</dd>";
      }
      if (policy.IsNumericsRequired == "True") {
        this.pwdPolicy += "<dd>Numerals[0-9],</dd>";
      }
      if (policy.IsSpecialCharsRequired == "True") {
        var strSplChars = policy.SpecialCharactersAllowed;
        this.pwdPolicy += "<dd> Non - alphabetic characters [" + strSplChars + "],</dd>";
      }
      this.pwdPolicy += "</dl>";
    });
  }
  loadLanguages() {
    this.ccapi.postData("master/languages", {}).subscribe((response: any) => {
      if (response.code == 200) {
        this.langlist = response.data;
      }
    });
  }
  UpdateUser() {
    if (this.userinfo.uname == undefined || this.userinfo.uname == "") {
      this.ccapi.openDialog('error', "Please enter name");
      return;
    }
    if (this.userinfo.uemail == undefined || this.userinfo.uemail == "") {
      this.ccapi.openDialog('error', "Please enter valid user emailid");
      return;
    }
    if (this.userinfo.umobileno == undefined || this.userinfo.umobileno == "") {
      this.ccapi.openDialog('error', "Please enter mobileno");
      return;
    }
    if (this.userinfo.umobileno.length < 10) {
      this.ccapi.openDialog('error', "Please enter valid mobileno");
      return;

    }
    if (this.userinfo.uloginid == undefined || this.userinfo.uloginid == "") {
      this.ccapi.openDialog('error', "Please enter loginid.");
      return;
    }
    if (this.userinfo.uusertype == undefined || this.userinfo.uusertype == "") {
      this.ccapi.openDialog('error', "Please select usertype");
      return;

    }
    var url = "user/UpdateUser";
    var postData = {
      userid: parseInt(this.userinfo.userid), status: 1, name: this.userinfo.uname, emailid: this.userinfo.uemail, loginid: this.userinfo.uloginid,
      mobileno: this.userinfo.umobileno, userrole: parseInt(this.userinfo.uusertype),
      displayname: this.userinfo.udisplayname, department: this.userinfo.udepartment, designation: this.userinfo.udesignation, sendemail: this.userinfo.sendemail,
      lang: this.userinfo.languageid
    };
    this.ccapi.postData("user/UpdateUser", postData).subscribe((resp: any) => {
      if (resp.code == "200" && resp.status == 'success') {
        this.ccapi.openDialog('success', resp.message);
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    });
  }
  UpdatePwd() {
    if (this.pwdinfo.oldpassword == "" || this.pwdinfo.oldpassword == undefined) {
      this.ccapi.openDialog('error', "Please enter Old Password");
      return;
    }
    if (this.pwdinfo.newpassword == "" || this.pwdinfo.newpassword == undefined) {
      this.ccapi.openDialog('error', "Please enter new Password");
      return;
    }
    if (this.pwdinfo.rnewpassword == "" || this.pwdinfo.rnewpassword == undefined) {
      this.ccapi.openDialog('error', "Please re-enter new Password");
      return;
    }
    if (this.pwdinfo.oldpassword == this.pwdinfo.newpassword) {
      this.ccapi.openDialog('error', "Old and new password should not be same");
      return;
    }
    var data = {
      userid: this.userinfo.userid,
      oldpassword: btoa(this.pwdinfo.oldpassword),
      newpassword: btoa(this.pwdinfo.newpassword),
      emailid: this.userinfo.uemail
    };
    this.ccapi.postData("user/changepassword", data).subscribe((resp: any) => {
      if (resp.code == "200" && resp.status == "success") {
        this.ccapi.openDialog('success', resp.message);
      }
      else {
        this.ccapi.openDialog('error', resp.message);
        return;
      }
    })
  }

 
}
