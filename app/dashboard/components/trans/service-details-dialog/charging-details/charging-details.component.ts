import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from "../../../../../shared/services/ccapi.service";
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { formatDate } from '@angular/common';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_FORMATS } from 'ng-pick-datetime-moment';

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
  selector: 'app-charging-details',
  templateUrl: './charging-details.component.html',
  styleUrls: ['./charging-details.component.css'],
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class ChargingDetailsComponent implements OnInit {


  public dateTime = new moment();
  displayedColumns: string[] = ["gtrid", "trans_type", "sourcechannel", "originating_timestamp", "charge_status", "requested_price", "charged_price", "tax_amount"];

  isOpen: any = true;
  dataSource: any;
  isLoadingResults = true;
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private ccapi: CcapiService) {
    this.dateObject = {
      startDate: new moment().subtract(11, 'days').startOf('day'),
      endDate: new moment().endOf('day')
    }
  }
   
  dateObject: {
    startDate: any;
    endDate: any;
  };

  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = (page - 1);
      this.getPage({ pageIndex: (this.pageObject.pageNo) });
    }
  }
   

  changePageSize(obj) {
    this.pageObject.pageSize = obj.pageSize;
    this.gettransactions();
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
    this.pageObject.pageNo = 1;
    this.pageObject.pageSize = 6;
    this.pageObject.totalPages = 0;
    this.pageObject.totalRecords = 0;

    this.orderByObject.ordercolumn = "";
    this.orderByObject.direction = "";
    this.getPage({ pageIndex: (this.pageObject.pageNo), pageSize: this.pageObject.pageSize });
  }
   

  gettransactions() {
    this.isLoadingResults = true;
    let requesrParams = {
      parentid: "",
      username: "",
      userrole: 0,
      reporttype: "servcharging",
      startdate: this.dateObject.startDate.format('YYYY-MM-DD HH:mm').toString(),
      enddate: this.dateObject.endDate.format('YYYY-MM-DD HH:mm').toString(),
      pageno: (this.pageObject.pageNo - 1) * this.pageObject.pageSize, 
      pagesize: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      order: this.orderByObject.direction,

    }
    this.ccapi.postData('subscriberdata/GetESTransactions', requesrParams).subscribe((response: any) => {
      if (response.code == "500" && response.status == "error") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status == "success") {
        if (response && response.data && response.data.transactions) {
          this.dataSource = new MatTableDataSource(response.data.transactions);
          this.pageObject.totalRecords = response.data.numFound;
          this.pageObject.totalPages = response.data.numFound;
          this.isLoadingResults = false;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.isLoadingResults = false;
        }
      }
      else {
        alert();
      }
    });
  };
  
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

