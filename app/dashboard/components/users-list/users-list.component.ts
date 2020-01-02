import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from '../../../shared/services/ccapi.service';
import { CcfactoryService } from "../../../shared/services/ccfactory.service";
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../shared/msgdialoguebox/msgdialoguebox.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';
import { ResetpasswordComponent } from '../users-list/resetpassword/resetpassword.component';
import { ConfirmDialogueBoxComponent } from '../../../shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { element } from '@angular/core/src/render3';
import { userclass } from '../../../shared/models/enums.model';

declare var require: any;
var $ = require('jquery');
var dt = require('datatables.net');
var dd = require('datatables-fixedcolumns');
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  animations: [
    trigger('openClose', [
      state('open', style({
        display: 'block',
        opacity: 1,
      })),
      state('closed', style({
        display: 'none',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.4s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ],
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  public isOpen: any = true;
  public pageObject: PageObject = new PageObject();
  public draw: any;
  public serviceProvidersList: any;
  public permission: any;
  public loginRole: any;
  public showBU: any;
  public userType: any;
  public userTypesList: any;
  public searchString: any = "";
  public usp: any = "";
  public fusp: any = "";
  public resetpwdinfo: any;
  public userObj: any;
  public fstatus: number = 1;
  constructor(private ccapi: CcapiService, private router: Router, private dialog: MatDialog, private zone: NgZone, private ccfactory: CcfactoryService) {
    // let loginrole:any = IMIapp.getRole();
    this.resetpwdinfo = {
      newpswd: "",
      confirmpswd: "",
    }
  }

  ngOnInit() {
    this.pageObject.pageNo = "1";
    this.pageObject.pageSize = "10";
    this.pageObject.totalPages = "0";
    this.pageObject.totalRecords = "0";
    this.draw = "";
    this.loginRole = this.ccapi.getRole();
    this.GetRoles();
    this.GetParentUserList();


    //this.ShowBusinessUnit();
    //this.GetUsersList();
    this.zone.runOutsideAngular(() => {
      window["manageuserrights"] = this.manageUserRights.bind(this);
      window["resetpassword"] = this.resetPassword.bind(this);
      window["sendpassword"] = this.sendPassword.bind(this);
      window["edituser"] = this.createuserDialog.bind(this);
    });
  }
  ngOnDestroy() {
    window["manageuserrights"] = null;
    window["resetpassword"] = null;
    window["sendpassword"] = null;
    window["edituser"] = null;
  }
  createuserDialog(id: any): void {
    if (id == null && id == undefined) {
      this.userObj = {
        userid: 0,
        user: null,
        roles: this.userTypesList,
        buunits: this.serviceProvidersList,
        mode: "insert"
      }
      const dialogRef = this.dialog.open(CreateUserDialogComponent, {
        width: '850px',
        data: this.userObj,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    else {
      var url = "user/GetUserDetailsByID/" + id;
      this.ccapi.postData(url, {}).subscribe((resp: any) => {
        if (resp.code == "200") {
          this.userObj = {
            userid:id,
            user: resp.data,
            roles: this.userTypesList,
            buunits: this.serviceProvidersList,
            mode: "update"
          }
          const dialogRef = this.dialog.open(CreateUserDialogComponent, {
            width: '850px',
            data: this.userObj,
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
          });
        }
        else {
          this.ccapi.openDialog('error', "Dear User, Currently we cannot process your request");
          return;
        }
      });
    }
  }

  manageUserRights(userid: any) {
    this.router.navigate(["/dashboard/managerights/" + userid]);
  }
  resetPassword(userid: any, loginid: any) {
    var resetpwdinfo = {
      loginid: loginid,
      userid:userid
    }
    const dialogRef = this.dialog.open(ResetpasswordComponent, {
      width: '850px',
      data: resetpwdinfo,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  
  sendPassword(emailid: any, userrole: any, userid: any) {
    var postdata = {
      email: emailid,
      captcha: '',
      userrole: userrole,
      id: userid
    }
    const dialogRef = this.dialog.open(ConfirmDialogueBoxComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Are you sure to send reset password link to  - ' + emailid + '?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.ccapi.postData("user/SendPassword", postdata).subscribe((resp: any) => {
          console.log(resp);
          if (resp.code == "200") {
            this.ccapi.openDialog('success', 'Password reset mail sent to User email.');
          }
        });
      }
    });
  }

  ngAfterViewInit() {

    $('#users_grid').on("click", ".edituser", function () {
      window["edituser"]($(this).attr("data-id"));
    });
    $('#users_grid').on("click", ".manageuserrights", function () {
      window["manageuserrights"]($(this).attr("data-id"));
    });
    $('#users_grid').on("click", ".resetpassword", function () {
      window["resetpassword"]($(this).attr("data-id"), $(this).attr("data-loginid"));
    });
    $('#users_grid').on("click", ".sendpassword", function () {
      window["sendpassword"]($(this).attr("data-emailid"), $(this).attr("data-userrole"), $(this).attr("data-id"));
    });
  }

  getUsersData() {
    this.GetUsersList();
  }
  public GetUsersList() {
    if (this.userType != undefined || this.userType != "")
      this.userType = this.userType;
    if (this.userTypesList != undefined && this.userTypesList.length > 0) {
      if (this.userType == undefined || this.userType == "") {
        this.userType = this.userTypesList[0].id;
        this.userType = parseInt(this.userType);
        this.showBU = "1";
      }
    }
    if (this.loginRole == '1010002') {
      this.usp = this.ccapi.getUserId();
      this.fusp = this.ccapi.getUserId();
    }
    if ($.fn.DataTable.isDataTable('#users_grid')) {
      $('#users_grid').dataTable().fnDestroy();
      $('#users_grid').empty();
    }
    let pageNumber: any = 1;

    try {
      var columns = [
        {
          "data": "id", title: "ID", width: "3%", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "name",
          title: "NAME",
          "render": function (data, type, row, meta) {
            if (type === 'display') {
              var editrow = '<a title="Edit user" data-id=\"' + row.id + '\" class="edituser"   href="javascript:void(0)">' + data + '</a>';
              return $('<div></div>').append(editrow).html();
            } else {
              return encodeURI(String(data));
            }
          }

        },
        {
          "data": "emailid", title: "EMAIL", "width": "190px", "class": "word-break", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "loginid", title: "LOGIN ID", "width": "150px", "class": "word-break", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "userrole", title: "USER ROLE", "width": "150px", "class": "word-break", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "createddate", title: "CREATED DATE", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "status",
          title: "STATUS",
          "width": "50px",
          "render": function (data, type, row, meta) {
            if (type === 'display') {
              return $(data == 1 ? "<span class='label label-sm label-success'/>" : (data == 2 ? "<span class='label label-sm label-danger'/>" : "<span class='label label-sm label-warning'/>"))
                .text(data == 1 ? "Active" : (data == 2 ? "Deleted" : "Inactive"))
                .wrap('<div></div>')
                .parent()
                .html();
            } else {
              return encodeURI(String(data));
            }
          }

        },
        {
          "data": "id", title: "Actions", "width": "150px",
          "render": function (data, type, row, meta) {
            if (type === 'display' && row["status"] != 2) {
              var resetPassword = '';
              var sendPassword = '<a title="Send Password" data-id=\"' + data + '\" data-emailid=\"' + row.emailid + '\" data-userrole=\"' + row.userroleid + '\"  href="javascript:void(0)" class="sendpassword btn btn-circle btn-icon-only btn-default"><i class="fa fa-key"></i></a>';
              // if (this.loginRole == "1010000") {
              resetPassword = '<a title="Force Reset Password"  data-id=\"' + data + '\"  data-loginid= \"' + row.loginid + '\" href="javascript:void(0)" class="resetpassword btn btn-circle btn-icon-only btn-default"><i class="icon-lock"></i></a>';
              // }
              var extendRights = '<a title="Rights Management"  data-id=\"' + data + '\" class="btn btn-circle btn-icon-only btn-default manageuserrights"><i class="icon-user-following"></i></a>';
              var html = $('<div></div>').append(sendPassword + resetPassword + extendRights).html();
              return html;

            }
            else {
              return "";
            }
          }
        }
      ];

      try {
        $('#users_grid').destroy();
      }
      catch (e) { }
      var tbl = $('#users_grid').DataTable({
        destroy: true,
        // bLengthChange:false,
        scrollX: true,
        scrollY: "400px",
        scrollCollapse: true,
        paging: true,
        processing: true,
        responsive: true,
        fixedColumns: {
          leftColumns: 1,
          rightColumns: 2
        },
        "bFilter": false,
        serverSide: true,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        order: [[0, 'desc']],
        ajax: (dataTablesParameters: any, callback) => {
          let requesrParams = { userrole: parseInt(this.userType), username: this.searchString, pageno: pageNumber, pagesize: dataTablesParameters.length, status: this.fstatus, parentid: this.fusp }
          var orderbyIndex = dataTablesParameters.order[0].column;
          this.ccapi.postData('user/GetAllUserList', requesrParams).subscribe((resp: any) => {
            let transactions: any[] = [];
            try {
              if (resp.code == "200") {
                try {
                  this.pageObject.totalRecords = resp.pageinfo.totalrecords;
                  this.pageObject.totalPages = resp.pageinfo.totalpages;
                  this.pageObject.pageSize = dataTablesParameters.length;
                  transactions = resp.data;
                } catch (e) {
                  if (resp.code == "200") {
                    this.pageObject.totalRecords = resp.pageinfo.totalrecords;
                    transactions = resp.transactionInfo.transactions;
                    if (!transactions) {
                      transactions = [];
                    }
                  }
                }
              }
            }
            catch (e) {
              console.log(e);
            }
            callback({
              recordsTotal: resp.pageinfo.totalrecords,
              recordsFiltered: resp.pageinfo.totalrecords,
              data: transactions,
              draw: dataTablesParameters.draw
            });
          }, (error => {
            // this.spinner.hide();
            console.log(error);
            let err: any = error.error;
            this.dialog.open(MsgdialogueboxComponent, {
              disableClose: true,
              width: '400px',
              data: { type: 'error', msg: error.message }
            });
            switch (err.code) {
              case "401":
                {
                  this.ccapi.clearSession();
                  this.router.navigate(["/login"]);
                }
                break;
            }
          }
            ));
        },
        "columns": columns
      });
      $('#users_grid').on('page.dt', function () {
        var info = tbl.page.info();
        if (info.page == 0) {
          info.page = 1
        }
        else {
          info.page += 1;
        }
        pageNumber = info.page;
      });


      //destroy: true,
      //data: refdata,
      //bJQueryUI: false,
      //paging: false,
      //ordering: false, "scrollX": true,
      //columns: columns, info: false,
      //pageLength: 10, searching: false
      // });

      //tbl.off('click', '.showchilddet').on('click', '.showchilddet', function () {

      //  var tr = $(this).closest('tr');
      //  var row = tbl.row(tr);
      //  var d = row.data();
      //  var _tmpctrl = "chg_" + d.serviceid + "_" + incrementid;

      //  if ($('#users_grid').parent().find('.srvdet').length > 0) {
      //    $('#users_grid').parent().find('.srvdet').html('').empty();
      //  }
      //  else {
      //    $('#users_grid').parent().append('<div class="srvdet"></div>');
      //  }
      //  $('#users_grid').parent().find('.srvdet').html(BindServiceInfoTab(d, _tmpctrl));
      //  setTimeout(function () {

      //    $compile(angular.element('#' + _tmpctrl))($scope);

      //    $apply();
      //  },
      //    200);

      //});
    }
    catch (e) { }
  }

  public GetParentUserList() {
    var postData = { userrole: parseInt('1010002'), username: "", pageno: 1, pagesize: 1000 };
    this.ccapi.postData("user/GetParentUserList", postData).subscribe((response: any) => {
      if (response.code == '200' && response.status == 'success') {
        this.serviceProvidersList = response.data;
        try {
          this.permission = response.permission;
        } catch (e) { }
      }
      else {
        this.ccapi.openDialog('error', "No service providers found");
      }
    });
  }

  public ShowBusinessUnit() {

    if (this.loginRole == '1010005') {
      this.showBU = "0";
      // buadmin = true;
    }
    else {

      if (this.userType == "1010003" || this.userType == "1010004" || this.userType == "1010005"
        || this.userType == "1010010" || this.userType == "1010012" || this.userType == "1010013"
        || this.userType == "1010014" || this.userType == "1010015" || this.userType == "1010016") {
        this.showBU = "1";
      }
      else {
        this.showBU = "0";
      }
    }
  }

  public GetRoles() {
    var roles = this.ccfactory.GetRoles().then(
      (res: any) => { // Success
        if (res.code != null && res.code == "200") {
          this.userTypesList = res.data;
          if (this.loginRole == '1010005') {
            for (var i = 0; i < this.userTypesList.length; i++) {
              if (this.userTypesList[i].id != '1010012') {
                this.userTypesList.splice(i, 1);
                i--;
              }
            }
          }
          else {
            for (var i = 0; i < this.userTypesList.length; i++) {
              if (this.userTypesList[i].id != '1010012' && this.userTypesList[i].id != '1010005') {
                this.userTypesList.splice(i, 1); i--;
              }
            }
          }

          this.GetUsersList();
        }
        else {
          this.ccapi.openDialog("error", "No this.usertypes found.");
        }
      },
      (msg: any) => { // Error
        this.ccapi.openDialog("error", "No this.usertypes found.");
      }
    );
  }



  //dispFixedCols() {
  //  if (1) {
  //    return {
  //      leftColumns: 1,

  //    };
  //  } else {
  //    return false;
  //  }

  //}
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
export class PageObject {
  public pageNo: any = 1;
  public pageSize: any = 20;
  public totalRecords: any = 0;
  public totalPages: any = 0;
}
