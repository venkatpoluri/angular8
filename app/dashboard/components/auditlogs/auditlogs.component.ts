import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from "src/app/shared/services/ccapi.service";
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { ServiceDetailsDialogComponent } from 'src/app/dashboard/components/trans/service-details-dialog/service-details-dialog.component';
import { CommonModule } from '@angular/common';
import apiresponse from 'src/app/dashboard/components/auditlogs/APIResponsejson.json';

import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_FORMATS } from 'ng-pick-datetime-moment';
//import messageTrans from '../campaign-trans/campaign-trans.json';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_CUSTOM_FORMATS = {
  parseInput: 'YYYY-MM-DD HH:mm',
  fullPickerInput: 'YYYY-MM-DD HH:mm',
  datePickerInput: 'YYYY-MM-DD',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-auditlogs',
  templateUrl: './auditlogs.component.html',
  styleUrls: ['./auditlogs.component.css'],
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
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})


export class AuditlogsComponent implements OnInit, AfterViewInit {

  public roleid: any = "";
  public UserTypesList: any[] = [];
  public Userslist: any[] = [];
  public usertype: any = "";
  public userid: any = "";
  public fullmessage: any = "";

  public dateTime = new moment();
  displayedColumns: string[] = ["loginid", "method", "actionperformed", "logtime", "action", "result", "message", "sessionid",
    "ip", "serverip"];

  isOpen: any = true;
  dataSource = new MatTableDataSource([]);
  isLoadingResults = true;
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();

  dateObject: {
    startDate: any;
    endDate: any;
  };

  toggle() {
    this.isOpen = !this.isOpen;
  }
  constructor(private ccapi: CcapiService, private dialog: MatDialog) {
    this.dateObject = {
      startDate: new moment().subtract(11, 'days').startOf('day'),
      endDate: new moment().endOf('day')
    }

  }

  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.getPage({ pageIndex: (this.pageObject.pageNo) });
    }
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.gettransactions();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;

    this.gettransactions();
  }




  ngOnInit() {
    this.pageObject.pageNo = 0;
    this.pageObject.pageSize = 10;
    this.pageObject.totalPages = 0;
    this.pageObject.totalRecords = 0;

    this.orderByObject.ordercolumn = "";
    this.orderByObject.direction = "";
    this.getPage({ pageIndex: (this.pageObject.pageNo), pageSize: this.pageObject.pageSize });
    this.roleid = this.ccapi.getRole();
    if (this.roleid == "1010000") {
      this.UserTypesList = [
        { id: "1010000", name: "Superadmin" },
        { id: "1010005", name: "Customer Care" },
        { id: "1010012", name: "SUB Customer Care" }
      ];


    }
    else if (this.roleid == "1010005") {
      this.UserTypesList = [
        { id: "1010012", name: "SUB Customer Care" }
      ];
    }
    this.usertype = this.UserTypesList[0].id;
    this.ChangeUsertype(this.usertype);
  }

  ChangeUsertype(usertype: any) {
    this.usertype = usertype;
    if (this.usertype == "1010000") {
      this.Userslist = [{ "id": "1", name: "Superadmin" }];
      this.userid = "1";
      setTimeout(function () {
        //IMIapp.unblockui();
      }, 1000);
    }
    else if (this.usertype == "1010005" || this.usertype == "1010012") {
      var _sessioobj = window.sessionStorage.getItem("ccusers_" + this.usertype);
      if (_sessioobj == null || _sessioobj == undefined || _sessioobj.length < 10) {
        var postData = { userrole: (this.usertype), username: "", pageno: 1, pagesize: 1000, status: 1, parentid: 0 };
        this.ccapi.postData("user/GetAllUserList", postData).subscribe((response: any) => {
          setTimeout(function () {
            //IMIapp.unblockui();
          }, 1000);
          if (response.code == "200") {
            this.Userslist = response.data;
            window.sessionStorage.setItem("ccusers_" + this.usertype, JSON.stringify(this.Userslist));
            this.userid = this.Userslist[0]["id"];
          }
          else {
            //toastrmsg('error', "Dear User, Error occurred while processing your request");
            this.ccapi.openDialog("error", "Dear User, Error occurred while processing your request...!");
          }

        });
      }
      else {
        this.Userslist = JSON.parse(_sessioobj);
        setTimeout(function () {
          //IMIapp.unblockui();
        }, 1000);
      }
    }
  }

  ngAfterViewInit() { }


  gettransactions() {
    this.isLoadingResults = true;

    let requesrParams = {
      "userid": this.userid,
      fromtime: this.dateObject.startDate.format('YYYY-MM-DD HH:mm').toString(),
      totime: this.dateObject.endDate.format('YYYY-MM-DD HH:mm').toString(),
      pageno: (this.pageObject.pageNo * this.pageObject.pageSize) + 1,
      pagesize: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      order: this.orderByObject.direction,
    }
    this.ccapi.postData('master/GetAuditLogs', requesrParams).subscribe((response: any) => {
      //response = apiresponse;

      if (response.code == "500" && response.status == "error") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status == "success") {
        if (response && response.data) {
          this.dataSource = new MatTableDataSource(response.data);
          //this.pageObject.totalRecords = response.data.numFound;
          //this.pageObject.totalPages = response.data.numFound;
          this.pageObject.totalRecords = response.data.length;
          this.isLoadingResults = false;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.isLoadingResults = false;
        }

        $('#auditlogs_grid').on('click', 'a.editrow', function () {
          var id = this.id;
          //var item = $.grep(this.auditlogslist, function (vitem) {
          //  return vitem.logid == id;
          //})[0];
          var recordDetails = this.auditlogslist.filter((element, index) => {
            return (element.logid == id);
          });
          this.logid = id;
          this.ShowMessage(recordDetails);
        })

        //if (this.userid != undefined && this.userid != '0')
        //  table.column(0).visible(true);
        //else
        //  table.column(0).visible(false);
      }
      else {
        alert();
      }
    });
  };


  serviceGroup(d): void {
    const dialogRef = this.dialog.open(ServiceDetailsDialogComponent, {
      data: { servicecode: d.status_code },
      disableClose: true,
      position: {
        top: '50px'
      },
      maxWidth: '95vw',
      maxHeight: '90vh',
      height: '90%',
      width: '95%'
    });
  }
  ShowMessage(item: any) {
    this.fullmessage = '';
    this.fullmessage = item.message;
    $('#fullmessage').val(item.message);
    this.ccapi.openDialog("warning", "");
  }
}

export class PageObject {
  public pageNo: number = 1;
  public pageSize: number = 10;
  public totalRecords: number = 0;
  public totalPages: number = 0;
}


export class OrderByObject {
  public ordercolumn: string = "";
  public direction: string = "";
}

