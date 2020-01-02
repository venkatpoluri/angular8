import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from "../../../../shared/services/ccapi.service";
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { ServiceDetailsDialogComponent } from '../../trans/service-details-dialog/service-details-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

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
  selector: 'app-webaoc-trans',
  templateUrl: './webaoc-trans.component.html',
  styleUrls: ['./webaoc-trans.component.css'],
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


export class WebaocTransComponent implements OnInit, AfterViewInit {

  public dateTime = new moment();
  displayedColumns: string[] = ["id_trans", "sname", "servicetype", "servicegroup", "consenttype", "transactiontimestamp","channel",
    "nodeip", "devicebrand", "devicemodel", "devicegroup", "tmpwaocstatus", "chargedamount", "actions"];

  isOpen: any = true;
  dataSource = new MatTableDataSource([]);
  isLoadingResults = true;
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  pagesizes = [5, 10, 20];

  dateObject: {
    startDate: any;
    endDate: any;
  };

  toggle() {
    this.isOpen = !this.isOpen;
  }
  constructor(private spinner: NgxSpinnerService,private ccapi: CcapiService, private dialog: MatDialog) {
    this.dateObject = {
      startDate: new moment().subtract(11, 'days').startOf('day'),
      endDate: new moment().endOf('day')
    }

  }

  changePage(page: number) {

    if (page) {
      this.pageObject.pageNo = page;
      this.getPage({ pageIndex: this.pageObject.pageNo });
    }
  }

  changePageSize(pagesize: number) {
    this.pageObject.pageSize = pagesize;
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
    this.pageObject.pageSize = 10;
    this.pageObject.totalPages = 0;
    this.pageObject.totalRecords = 0;

    this.orderByObject.ordercolumn = "";
    this.orderByObject.direction = "";
    this.getPage({ pageIndex: (this.pageObject.pageNo), pageSize: this.pageObject.pageSize });
  }

  ngAfterViewInit() { }


  gettransactions() {
    this.isLoadingResults = true;
    let requesrParams = {
      parentid: "",
      username: "",
      userrole: 0,
      startdate: this.dateObject.startDate.format('YYYY-MM-DD HH:mm').toString(),
      enddate: this.dateObject.endDate.format('YYYY-MM-DD HH:mm').toString(),
      pageno: (this.pageObject.pageNo - 1) * this.pageObject.pageSize, // (this.pageObject.pageNo * this.pageObject.pageSize) + 1,
      pagesize: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      order: this.orderByObject.direction,

    }
    this.spinner.show();
    this.ccapi.postData('subscriberdata/GetWEBAOCTransactions', requesrParams).subscribe((response: any) => {
      //response = messageTrans;  //TEMP
      this.spinner.hide();
      if (response && response.code == "500" && response.status == "error") {
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
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.isLoadingResults = false;
      }
    });
  };


  serviceGroup(d): void {
    const dialogRef = this.dialog.open(ServiceDetailsDialogComponent, {
      data: { servicecode: d.status_code },
      disableClose: true,
      panelClass: 'custom-modalbox',
      position: {
        top: '50px'
      },
      maxWidth: '95vw',
      maxHeight: '90vh',
      height: '90%',
      width: '95%'
    });
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

