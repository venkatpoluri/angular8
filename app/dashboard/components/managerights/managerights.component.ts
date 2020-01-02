import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CcapiService } from "../../../shared/services/ccapi.service";
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-managerights',
  templateUrl: './managerights.component.html',
  styleUrls: ['./managerights.component.css']
})
export class ManagerightsComponent implements OnInit {
  public loginrole: any = "";
  public permissionsby: number = 0;
  public userid: any = "";
  public stateusername: string = "";
  public stateuserrole: string = "";
  public menuData: any[] = [];
  public menusList: any[] = [];
  public roleid: string = '1010012';
  public rolesmaster: any[] = [];
  public mrightsInfo: any;
  public selectedPermissions: any[] = [];
  constructor(private router: Router, private activeRoute: ActivatedRoute, private ccapi: CcapiService, private dialog: MatDialog) {
    this.mrightsInfo = {
      roleid: "",
      userid: "",
      permissions: this.selectedPermissions
    }
  }

  ngOnInit() {
    this.userid = this.activeRoute.snapshot.params['id'];
    console.log("userid: " + this.userid);
    this.loginrole = this.ccapi.getRole();
    this.mrightsInfo.roleid = this.loginrole;

    //if (this.loginrole == '1010012' || this.roleid == "1010012") {
    // // this.router.navigate(["/unauthorized"]);
    //  return;
    //}
    if (this.userid != null && this.userid != undefined && parseInt(this.userid) > 0) {
      this.permissionsby = 1;
      this.mrightsInfo.userid = this.userid;
    }
    this.getUserDetails();
    this.ccapi.postData("master/menuuserroles", {}).subscribe((resprole: any) => {
      if (resprole.code == "200") {
        this.rolesmaster = resprole.data;
        this.getRolesByType();
        this.roleid = this.rolesmaster[0].id;
        this.mrightsInfo.roleid = this.rolesmaster[0].id;
        this.onchangeRole();
      }
    });
  }
  getUserDetails() {
    if (this.userid != undefined && this.userid != '0') {
      this.ccapi.postData("user/getuserdetailsbyid/" + this.userid, {}).subscribe((resp: any) => {
        if (resp.code == "200") {
          if (resp.data != undefined && resp.data != null && resp.data.length > 0) {
            this.stateusername = resp.data[0].username;
            this.stateuserrole = "(" + resp.data[0].userrole + ")";
          }
          else {
            this.ccapi.openDialog('warning', "No User Found");
            return;
          }
        }
        else {
          this.ccapi.openDialog('warning', "Dear User, Error occurred while processing your request");
          return;
        }
      });
    }
  }
  getRolesByType() {
    try {
      if (this.loginrole == '1010005') {
        for (var _r = 0; _r < this.rolesmaster.length; _r++) {
          if (this.rolesmaster[_r].id != '1010012') {
            this.rolesmaster.splice(_r, 1);
            _r--;
          }
        }
      }
      else {
        for (var _r = 0; _r < this.rolesmaster.length; _r++) {
          if (this.rolesmaster[_r].id != '1010012' && this.rolesmaster[_r].id != '1010005') {
            this.rolesmaster.splice(_r, 1);
            _r--;
          }
        }
      }
    }
    catch (e) { }
  }
  onchangeRole() {
    this.mrightsInfo.roleid = this.roleid;
    this.getMenudata();
  }
  resetuser() {
    try {
      var obj = { "userid": this.userid };
      if (this.userid != undefined && this.userid != '0') {
        this.ccapi.postData("user/ResetUserPermissions", obj).subscribe((resp: any) => {
          if (resp.code == "200") {
            this.ccapi.openDialog('success', resp.message);
            this.getMenudata();
          }
          else {
            if (resp.message != undefined && resp.message != null)
              this.ccapi.openDialog('error', resp.message);
            else
              this.ccapi.openDialog('error', "Sorry, we are unable to process your request.");
          }
        });
      }
    }
    catch (e) { }
  }
  getMenudata() {

    this.menuData = [];
    var url = "user/MenuPermission";
    var postdata = { "id": this.roleid };// "id": $scope.roleid
    if (this.userid != null && this.userid.length > 0 && parseInt(this.userid) > 0) {
      url = "user/MenuPermissionByUserId";
      postdata = { "id": this.userid };
    }
    this.ccapi.postData(url, postdata).subscribe((resp: any) => {
      this.selectedPermissions = [];
      if (resp.code == "200") {
        this.menuData = resp.data;
        //for (let i = 0; i < this.menuData.length; i++) {
        //  var childs = this.menuData.find(x => x.parentid == this.menuData[i].menuid);
        //  if (childs != undefined) {
        //    this.menuData[i].childcount = childs.length;
        //    if (this.menuData[i].childcount > 0) {
        //      this.menuData[i].plusMinusIcon = "fa fa-plus";
        //    } else {
        //      this.menuData[i].plusMinusIcon = "";
        //    }
        //  }
        //  else {
        //    this.menuData[i].childcount = 0;
        //  }
        //  if (this.menuData[i].parentid == 0) {
        //    this.menuData[i].menulevel = 1;
        //  }
        //  else {
        //    this.menuData[i].menulevel = 2;
        //  }
        //}
        let temparr = [];
        for (let i = 0; i < this.menuData.length; i++) {
          let childarr = [];
          this.menuData[i].childcount = 0;
          if (this.menuData[i].parentid == 0) {
            this.menuData[i].menulevel = 1;
          }
          for (let j = 0; j < this.menuData.length; j++) {
            if (this.menuData[i].menuid == this.menuData[j].parentid) {
              this.menuData[j].menulevel = 2;
              childarr.push(this.menuData[j]);
            }
          }
          if (childarr.length > 0) {
            this.menuData[i].plusMinusIcon = "fa fa-plus";
            this.menuData[i].childcount = childarr.length;
            temparr = [...temparr, this.menuData[i], ...childarr];
          } else if (this.menuData[i].parentid == '0' && childarr.length == 0) {
            this.menuData[i].plusMinusIcon = "";
            this.menuData[i].childcount = 0;
            temparr.push(this.menuData[i]);
          }
        }
        console.log(temparr);
        this.menusList = temparr;
      }
      else if (resp.code == "405") {
        // this.router.navigate(["/unauthorized"]);
      }
      else {
        this.ccapi.openDialog('warning', resp.message);
      }
    });
  }
  liclickevent(m) {
    var $li = $("#ulmenus").find("[parentid='" + m.menuid + "']");
    if ($li.length > 0) {
      if ($li.hasClass("hide")) {
        $li.removeClass("hide").addClass("show bgchild");
        m.plusMinusIcon = "fa fa-minus";
      }
      else {
        m.plusMinusIcon = "fa fa-plus";
        $li.addClass("hide").removeClass("show bgchild");
      }
    }
  }
  getPermission(key, p) {
    try {
      return this.menuData.find(x => x.menukey == key)[p] == "0" ? "" : "checked";
    } catch (e) { return ""; }
  }
  updateSelectedPermissions(event) {
    var keys = event.target.id.split('_')
    var menukey = event.target.name;
    var type = keys[0];
    var obj = {
      "menukey": menukey,
      "roleid": this.mrightsInfo.roleid,
      "userid": this.userid,
      "view": "0",
      "add": "0",
      "edit": "0",
      "moderate": "0",
      "export": "0",
      "ismodified": "1"
    }
    var addedobj = obj;
    var menupermissions = this.selectedPermissions.find(x => x.menukey == menukey);
    if (menupermissions == undefined || menupermissions.length == 0) {
      var rolemenupermissions = this.menuData.find(x => x.menukey == menukey);
      if (rolemenupermissions == undefined || rolemenupermissions.length == 0) {
        addedobj = obj;
      }
      else {
        addedobj = rolemenupermissions;
      }
    }
    else {
      addedobj = menupermissions;
    }

    if (event.target.checked) {
      if (type == "siview") {
        addedobj.view = "1"
      }
      else if (type == "siadd") {
        addedobj.add = "1"
      }
      else if (type == "siedit") {
        addedobj.edit = "1"
      }
      else if (type == "simoderate") {
        addedobj.moderate = "1"
      }
      else if (type == "siexport") {
        addedobj.export = "1"
      }
      if (menupermissions == undefined) {
        addedobj.ismodified = "1";
        this.selectedPermissions.push(addedobj);
      }
    }
    else {
      if (type == "siview") {
        addedobj.view = "0"
      }
      else if (type == "siadd") {
        addedobj.add = "0"
      }
      else if (type == "siedit") {
        addedobj.edit = "0"
      }
      else if (type == "simoderate") {
        addedobj.moderate = "0"
      }
      else if (type == "siexport") {
        addedobj.export = "0"
      }
      if (menupermissions == undefined) {
        addedobj.ismodified = "1";
        this.selectedPermissions.push(addedobj);
      }
    }
    this.mrightsInfo.permissions = this.selectedPermissions;
    console.log(this.mrightsInfo.permissions);
  }
  SaveManagerights() {
    console.log(this.mrightsInfo)
    if (this.mrightsInfo.permissions != undefined && this.mrightsInfo.permissions.length == 0) {
      this.ccapi.openDialog('error', "Please do changes to submit your request");
    }
    else {
      console.log(this.mrightsInfo)
      this.ccapi.postData('user/managepermissions', this.mrightsInfo).subscribe((resp: any) => {
        if (resp.code == "200") {
          this.ccapi.openDialog("success", resp.message);
          this.getMenudata();
        }
        else if (resp.code == "405") {
          this.router.navigate(["/unauthorized"]);
        }
        else {
          if (resp.message != undefined && resp.message != null)
            this.ccapi.openDialog('error', resp.message);
          else
            this.ccapi.openDialog('error', "Sorry, we are unable to process your request.");
        }

      }),
        (error => { console.log(error); });
    }
  }
}
