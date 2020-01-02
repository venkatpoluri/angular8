import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { CcapiService } from "../../../../../shared/services/ccapi.service";
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

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
  selector: 'app-service-requests',
  templateUrl: './service-requests.component.html',
  styleUrls: ['./service-requests.component.css'],
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class ServiceRequestsComponent implements OnInit {


  public dateTime = new moment();
  displayedColumns: string[] = ["gtrid", "trans_type", "originating_timestamp", "sourcechannel", "sendercode", "message", "final_status", "charge_status", "charged_price"];

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
      reporttype: "activations",
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

