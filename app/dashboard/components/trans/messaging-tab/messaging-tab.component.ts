import { Component, OnInit, NgZone } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { HttpHeaders } from '@angular/common/http';
import { ServiceDetailsDialogComponent } from '../../trans/service-details-dialog/service-details-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
declare var require: any;
var $ = require('jquery');
var dt = require('datatables.net');
var dd = require('datatables-fixedcolumns');
import { formatDate } from '@angular/common';


declare var moment: any;

var dy = require('daterangepicker/daterangepicker');
@Component({
  selector: 'app-messaging-tab',
  templateUrl: './messaging-tab.component.html',
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
  styleUrls: ['./messaging-tab.component.css']
})
export class MessagingTabComponent implements OnInit {
  Date = new Date();
  NgxSpinnerService: any;
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
  data: { startdate: string; enddate: string; };
  constructor(private ccapiService: CcapiService, private router: Router, private dialog: MatDialog, private zone: NgZone, private spinner: NgxSpinnerService) {
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
      //window["serviceDetails"] = this.serviceGroup.bind(this);
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
    //$('#messaging_grid').on("click", ".serviceGroup", function () {
    //  window["serviceDetails"]($(this).attr("data-id"));
    //});

    $('#messaging_grid').on("click", ".manageuserrights", function () {
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
    if ($.fn.DataTable.isDataTable('#messaging_grid')) {
      $('#messaging_grid').dataTable().fnDestroy();
      $('#messaging_grid').empty();
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
          "data": "service_type", title: "CHARGE TYPE", "width": "190px", "class": "word-break", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "servicegroup", title: "SERVICE GROUP", "width": "150px", "class": "word-break", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "trans_type", title: "TRANS TYPE", "width": "150px", "class": "word-break", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "originating_timestamp", title: "TRANS DONE ON", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "sourcechannel", title: "SOURCE CHANNEL", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "sendercode", title: "SENDER ID", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "message", title: "MESSAGE", "className": "td-break", "width": "300px", "render": function (data, type, row) {
            if (type === 'display' && data != null) {
              data = data.replace(/(\r?\n|\r)/gm, ' ');
              if (data.length > 200) {
                return '<span class="show-ellipsis" title="' + esc(data) + '">' + $("<div />").text(data.substr(0, 200)).html() + '</span><span class="no-show">' + data.substr(200) + '</span>';
              } else {
                return $("<div />").text(data).html();
              }
            } else {
              return $("<div />").text(data).html();
            }
          }
        },

        {
          "data": "deliver_status", title: "MSG DELIVERY STATUS", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "submittimestamp", title: "SUBMITED ON", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "delivered_on", title: "MSG DELIVERED ON", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "partner_del_status", title: "PARTNER NOTIFY STATUS", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "partner_del_timestamp", title: "NOTIFY STATUS ON", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "charge_status", title: "CHARGE STATUS", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "charged_price", title: "CHARGE VALUE(B)", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },
        {
          "data": "final_status", title: "FINAL STATUS", "width": "150px", "render": function (data) {
            return encodeURI(String(data));
          }
        },


        {
          "data": "gtrid", title: "ACTIONS", "width": "150px", "render": function (data, type, row, meta) {
            if (type === 'display') {


              var _html = '';

              _html += '<button  title="Get Service Details" class="btn black mt-ladda-btn button-ladda btn-circle btn-outline btn-xs showServices serviceGroup showchilddet" \"> '
                + '<i class="fa fa-eye"></i>'
                + '</button>';

              var _status = row['deliver_status'];

              {
                _html += '<button  title="Re-Send Message" class="btn black mt-ladda-btn button-ladda btn-circle btn-outline btn-xs smsresend" \"> '
                  + '<i class="fa fa-envelope-o"></i>'
                  + '</button>';
              }

              return _html;

            } else {
              return data;
            }
          }
        }
      ];

      try {
        $('#messaging_grid').destroy();
      }
      catch (e) { }
      var tbl = $('#messaging_grid').DataTable({
        destroy: true,
        // bLengthChange:false,
        scrollX: true,
        scrollY: "400px",
        scrollCollapse: true,
        paging: true,
        language: {
          infoEmpty: "<div>No Data Available.</div>",
          emptyTable: "<div>No Data Available.</div>",
          zeroRecords: "<div>No Data Available.</div>"
        },
        processing: true,
        responsive: true,
        fixedColumns: {
          leftColumns: 1,
          rightColumns: 1
        },
        "bFilter": false,
        serverSide: true,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        order: [[0, 'desc']],
        ajax: (dataTablesParameters: any, callback) => {
          let requesrParams = { userrole: parseInt(this.userType), username: this.searchString, pageno: pageNumber, pagesize: dataTablesParameters.length, parentid: this.fusp, startdate: "", enddate: "" }
          requesrParams.startdate = this.range3.fromDate;
          requesrParams.enddate = this.range4.fromDate;

          // let requesrParams: any = { userrole: 1010005, username: "", pageno: pageNumber, pagesize: dataTablesParameters.length, status: "", parentid: 0 }
          var orderbyIndex = dataTablesParameters.order[0].column;
          this.spinner.show();
          this.ccapiService.postData('subscriberdata/GetMessagingTransactions', requesrParams).subscribe((resp: any) => {
            this.spinner.hide();
            let transactions: any[] = [];
            try {
              if (resp.code == "200" && !(resp.data == null)) {
                try {
                  this.pageObject.totalRecords = resp.data.numFound;
                  this.pageObject.totalPages = resp.data.numFound;
                  this.pageObject.pageSize = dataTablesParameters.length;
                  transactions = resp.data.transactions;

                } catch (e) {

                }
              }

              else {
                this.pageObject.totalRecords = 0;
                this.pageObject.totalPages = 0;
                this.pageObject.pageSize = 0;
                // this.openDialog('error', "No Data found");
              }
            }
            catch (e) {
              console.log(e);
            }
            callback({
              recordsTotal: this.pageObject.totalRecords != 'null' ? this.pageObject.totalRecords : 0,
              recordsFiltered: this.pageObject.totalPages,
              data: transactions,
              draw: dataTablesParameters.draw
            });
          }, (error => {
            this.spinner.hide();
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
      $('#messaging_grid').on('page.dt', function () {
        var info = tbl.page.info();
        if (info.page == 0) {
          info.page = 1
        }
        else {
          info.page += 1;
        }
        pageNumber = info.page;
      });

      $('#messaging_grid tbody').on("click", ".serviceGroup", ($event) => {
        var tr = $(this).closest('tr');
        var row = tbl.row(tr);
        var d = row.data();
        this.serviceGroup(d);
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

  serviceGroup(d): void {

    debugger;
    const dialogRef = this.dialog.open(ServiceDetailsDialogComponent, {
      width: '1024px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result == 'success') this.bindGrpInfo();
    });

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

var esc = function (t) {
  return t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
