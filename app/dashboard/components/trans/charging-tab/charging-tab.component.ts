import { Component, OnInit, NgZone } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { HttpHeaders } from '@angular/common/http';
declare var require: any;
var $ = require('jquery');
var dt = require('datatables.net');
var dd = require('datatables-fixedcolumns');
import { formatDate } from '@angular/common';
declare var moment: any;
var dy = require('daterangepicker/daterangepicker');
@Component({
  selector: 'app-charging-tab',
  templateUrl: './charging-tab.component.html',
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
  styleUrls: ['./charging-tab.component.css']
})
export class ChargingTabComponent implements OnInit {
  Date = new Date();
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
  public chargingtrans: any ="chargingtrans";
  data: { startdate: string; enddate: string; };
  constructor(private ccapiService: CcapiService, private router: Router, private dialog: MatDialog, private zone: NgZone) {
    // let loginrole:any = IMIapp.getRole();

    this.data = {

      startdate: formatDate(new Date().setDate(1), 'yyyy/MM/dd ', 'en-US', '') + '00:00',
      enddate: formatDate(new Date, 'yyyy/MM/dd ', 'en-US', '') + '23:59'

    }
  }
  public range3 = { fromDate: formatDate(new Date, 'yyyy/MM/dd hh:mm', 'en-US', '') };
  public range4 = { fromDate: formatDate(new Date, 'yyyy/MM/dd hh:mm', 'en-US', '') }; 
  ngOnInit() {


    this.zone.runOutsideAngular(() => {
      window["bindCharts3"] = this.setDateRange3.bind(this);
      window["bindCharts4"] = this.setDateRange4.bind(this);
    });
    $('#demo3').daterangepicker({
      "singleDatePicker": true,
      "timePicker": true,
      "timePicker24Hour": true,
      timePickerSeconds: false,
      showDropdowns: false,
      //minDate: moment().endOf('day'),
      //maxDate: moment().add(5, 'years'),
      locale: {
        format: 'YYYY/MM/DD  H:mm'
      },

    }, function (start, end, label) {
      window["bindCharts3"](formatDate(start, 'yyyy/MM/dd H:mm', 'en-US', ''));
      // console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });

    $('#demo4').daterangepicker({
      "singleDatePicker": true,
      "timePicker": true,
      "timePicker24Hour": true,
      timePickerSeconds: false,
      showDropdowns: false,
      //minDate: moment().endOf('day'),
      //maxDate: moment().add(5, 'years'),
      locale: {
        format: 'YYYY/MM/DD  H:mm'
      },

    }, function (start, end, label) {
      window["bindCharts4"](formatDate(start, 'yyyy/MM/dd H:mm', 'en-US', ''));

      //  console.log('New date range selected: ' + start.format('YYYY-MM-DD'));
    });
    this.pageObject.pageNo = "1";
    this.pageObject.pageSize = "10";
    this.pageObject.totalPages = "0";
    this.pageObject.totalRecords = "0";
    this.draw = "";
    this.loginRole = this.ccapiService.getRole();
    this.GetRoles();
    this.GetParentUserList();
    //this.ShowBusinessUnit();
    this.setDateRange3(this.data.startdate);
    this.setDateRange4(this.data.enddate);
    this.GetUsersList();
  }
  ngOnDestroy() {
    window["manageuserrights"] = null;
  }


  setDateRange3(startdate) {
    this.range3 = { fromDate: startdate };
  }
  setDateRange4(startdate) {
    this.range4 = { fromDate: startdate };
  }
  ngAfterViewInit() {

    $('#charging_grid').on("click", ".manageuserrights", function () {
      window["manageuserrights"]($(this).attr("data-id"));
    });
  }
  public GetUsersList() {
    this.userType = 0;
    if (this.userType != undefined || this.userType != "")
      this.userType = this.userType;
    if (this.userTypesList != undefined && this.userTypesList.length > 0) {
      if (this.userType == undefined || this.userType == "") {
        this.userType = this.userTypesList[0].id;
        this.userType = parseInt(this.userType);
      }
    }
    if (this.loginRole == '1010002') {
      this.usp = this.ccapiService.getUserId();
      this.fusp = this.ccapiService.getUserId();
    }
    if ($.fn.DataTable.isDataTable('#charging_grid')) {
      $('#charging_grid').dataTable().fnDestroy();
      $('#charging_grid').empty();
    }
    let pageNumber: any = 1;

    try {
      var columns = [
        {
          "data": "gtrid", title: "GTRID", width: "3%", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "servicename", "width": "190px",
          title: "SERVICE NAME",
          "render": function (data, type, row, meta) {
            return encodeURI(String(data));
          }

        },
        {
          "data": "chargetype", title: "CHARGE TYPE", "width": "190px", "class": "word-break", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "serivcegroup", title: "SERVICE GROUP", "width": "150px", "class": "word-break", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "transtype", title: "TRANS TYPE", "width": "150px", "class": "word-break", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "transdoneon", title: "TRANS DONE ON", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "sourcechannel", title: "SOURCE CHANNEL", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "senderid", title: "SENDER ID", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "message", title: "MESSAGE", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "msgdeliverystatus", title: "MSG DELIVERY STATUS", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "msgdeliveredon", title: "MSG DELIVERED ON", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "partnernotifystatus", title: "PARTNER NOTIFY STATUS", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "notifystatuson", title: "NOTIFY STATUS ON", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "chargestatus", title: "CHARGE STATUS", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "chargevalue", title: "CHARGE VALUE(B)", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },

        {
          "data": "id", title: "Actions", "width": "150px",
          "render": function (data, type, row, meta) {
            if (type === 'display' && row["status"] != 2) {
              var resetPassword = '';
              var sendPassword = '<a title="Send Password" id="' + row.id + '" href="javascript:void(0)" class="sendpassword btn btn-circle btn-icon-only btn-default"><i class="fa fa-key"></i></a>';
              //if (role == "1010000") {
              resetPassword = '<a title="Force Reset Password" id="' + row.id + '" href="javascript:void(0)" class="resetpswd btn btn-circle btn-icon-only btn-default"><i class="icon-lock"></i></a>';
              //}
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
        $('#charging_grid').destroy();
      }
      catch (e) { }
      var tbl = $('#charging_grid').DataTable({
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
          let requesrParams = { userrole: parseInt(this.userType), username: this.searchString, pageno: pageNumber, pagesize: dataTablesParameters.length, parentid: this.fusp, startdate: "", enddate: "",reporttype:this.chargingtrans}
          requesrParams.startdate = this.range3.fromDate;
          requesrParams.enddate = this.range4.fromDate;

          // let requesrParams: any = { userrole: 1010005, username: "", pageno: pageNumber, pagesize: dataTablesParameters.length, status: "", parentid: 0 }
          var orderbyIndex = dataTablesParameters.order[0].column;
          // this.spinner.show();
          this.ccapiService.postData('SubscriberData/getESTransactions', requesrParams).subscribe((resp: any) => {
            //this.spinner.hide();
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
                  this.ccapiService.clearSession();
                  this.router.navigate(["/login"]);
                }
                break;
            }
          }
            ));
        },
        "columns": columns
      });
      $('#charging_grid').on('page.dt', function () {
        var info = tbl.page.info();
        if (info.page == 0) {
          info.page = 1
        }
        else {
          info.page += 1;
        }
        pageNumber = info.page;
      });


    }
    catch (e) { }
  }

  public GetParentUserList() {
    var postData = { userrole: parseInt('1010002'), username: "", pageno: 1, pagesize: 1000 };
    this.ccapiService.postData("user/GetParentUserList", postData).subscribe((response: any) => {
      if (response.code == '200' && response.status == 'success') {
        this.serviceProvidersList = response.data;
        try {
          this.permission = response.permission;
        } catch (e) { }
      }
      else {
        this.openDialog('error', "No service providers found");
      }
    });
  }



  public GetRoles() {
    this.ccapiService.postData("master/UserRoles", {}).subscribe((response: any) => {
      if (response.code != null && response.code == "200") {
        this.userTypesList = [];
        let UploadusertypesList: any = [];
        this.userTypesList = response.data;
        UploadusertypesList = this.userTypesList;
        //this.ccapiService.setSession("oauth", JSON.stringify(response.data));
        this.GetUsersList();
      }
      else {
        alert(response.message);
        this.openDialog("error", "No this.usertypes found.");
      }
    }), (error => { console.log(error) });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }


  openDialog(alert: string, text: string) {
    this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: text }
    });
  }
}
export class PageObject {
  public pageNo: any = 1;
  public pageSize: any = 20;
  public totalRecords: any = 0;
  public totalPages: any = 0;
}


