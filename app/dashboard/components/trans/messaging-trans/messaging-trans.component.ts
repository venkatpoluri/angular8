import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from "../../../../shared/services/ccapi.service";
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { ServiceDetailsDialogComponent } from '../../trans/service-details-dialog/service-details-dialog.component';


import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_FORMATS } from 'ng-pick-datetime-moment';
//import messageTrans from '../messaging-trans/message-trans.json';
import { ConfirmDialogueBoxComponent } from 'src/app/shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { MsgdialogueboxComponent } from 'src/app/shared/msgdialoguebox/msgdialoguebox.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from '../../../../shared/pipes/custompipes.pipe';
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
  selector: 'app-messaging-trans',
  templateUrl: './messaging-trans.component.html',
  styleUrls: ['./messaging-trans.component.css'],
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


export class MessagingTransComponent implements OnInit, AfterViewInit {

  public dateTime = new moment();
  displayedColumns: string[] = ["gtrid", "servicename", "service_type", "servicegroup", "trans_type", "originating_timestamp", "sourcechannel", "sendercode",
    "message", "deliver_status", "submittimestamp", "delivered_on", "partner_del_status", "partner_del_timestamp", "charge_status", "charged_price", "final_status", "actions"];

  isOpen: any = true;
  dataSource = new MatTableDataSource([]);
  isLoadingResults = true;
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;


  //messageTransColumns = [
  //  {
  //    "data": "gtrid", title: "GTRID"
  //  },
  //  {
  //    "data": "servicename", title: "SERVICE NAME",
  //  },
  //  {
  //    "data": "service_type", title: "CHARGE TYPE" 
  //  },
  //  {
  //    "data": "servicegroup", title: "SERVICE GROUP" 
  //  },
  //  {
  //    "data": "trans_type", title: "TRANS TYPE" 
  //  },
  //  {
  //    "data": "originating_timestamp", title: "TRANS DONE ON" 
  //  },
  //  {
  //    "data": "sourcechannel", title: "SOURCE CHANNEL" 
  //  },
  //  {
  //    "data": "sendercode", title: "SENDER ID" 
  //  },
  //  {
  //    "data": "message", title: "MESSAGE" 
  //  },

  //  {
  //    "data": "deliver_status", title: "MSG DELIVERY STATUS" 
  //  },
  //  {
  //    "data": "submittimestamp", title: "SUBMITED ON" 
  //  },
  //  {
  //    "data": "delivered_on", title: "MSG DELIVERED ON" 
  //  },
  //  {
  //    "data": "partner_del_status", title: "PARTNER NOTIFY STATUS" 
  //  },
  //  {
  //    "data": "partner_del_timestamp", title: "NOTIFY STATUS ON" 
  //  },
  //  {
  //    "data": "charge_status", title: "CHARGE STATUS" 
  //  },
  //  {
  //    "data": "charged_price", title: "CHARGE VALUE(B)" 
  //  },
  //  {
  //    "data": "final_status", title: "FINAL STATUS" 
  //  }
  //  //{
  //  //  "data": "gtrid", title: "ACTIONS" 
  //  //}
  //];



  //getkeysfromarray() {
  //  this.displayedColumns = [];
  //  for (var i = 0; i < this.messageTransColumns.length; i++) {
  //    var _col = this.messageTransColumns[i].data.toString();
  //    if (this.displayedColumns.indexOf(_col) <= 0) {
  //      this.displayedColumns.push(_col);
  //    }
  //  }
  //}



  dateObject: {
    startDate: any;
    endDate: any;
  };
   

  toggle() {
    this.isOpen = !this.isOpen;
  }
  constructor(private ccapi: CcapiService, private dialog: MatDialog, private spinner: NgxSpinnerService) {
    this.dateObject = {
      startDate: new moment().subtract(11, 'days').startOf('day'),
      endDate: new moment().endOf('day')
    }



    //this.dateObject = {
    //  startDate: new Date(2018, 3, 12, 10, 30),
    //  endDate: new Date(2018, 3, 12, 10, 30),
    //  minEndDate: this.dateObject.startDate,
    //  maxStartDate: this.dateObject.minEndDate
    //}

  }

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

  fileDownload() {
    const postdata = {
      startdate: new CustomDateFormatPipe().transform(this.dateTime.subtract(11, 'days').startOf('day'), '', ''),
      enddate: new CustomDateFormatPipe().transform(this.dateTime.endOf('day'), '', ''),
      reporttype: "messagingtrans",
      start: 0,
      length: 100000,
      servicecode: "",
      //filters: $scope.filters,
      //servicegroup: $scope.servicegroup
    };
    this.ccapi.postData("subscriberdata/DownloadESReport",  postdata).subscribe((resp: any) => {
      if (resp != null && resp.status == "200" && resp.data != null && resp.data.data != null
        && resp.data.data.length > 10 && resp.data.data.indexOf("http") == 0) {
        window.open(resp.data.data, '_blank', '')
      }
      else {
        this.dialog.open(MsgdialogueboxComponent, {
          disableClose: true,
          width: '400px',
          data: { type: 'error', msg: resp.message }
        });
      }
    });
  }


  ngOnInit() {
    this.pageObject.pageNo = 0;
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
      pageno: (this.pageObject.pageNo * this.pageObject.pageSize) + 1,
      pagesize: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      order: this.orderByObject.direction,

    }
    this.spinner.show();
    this.ccapi.postData('subscriberdata/GetMessagingTransactions', requesrParams).subscribe((response: any) => {
      //response = messageTrans;  //TEMP
      this.spinner.hide();
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


  serviceGroup(d): void {
    const dialogRef = this.dialog.open(ServiceDetailsDialogComponent, {
      data: { servicecode: d.serviceid },
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


  resendMessage(d) {
    const dialogRef = this.dialog.open(ConfirmDialogueBoxComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Please Confirm to Resend this message',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {   //close : true 
        var postdata = {
          serviceIdentifier: d.serviceid,
          chargeCode: "",
          description: "",
          currency: "",
          //language: $scope.accountinfo.subscriber.language,
          senderId: d.sendercode,
          message: d.message,
          msgType: 'text'
        };

        if (d.dcs != undefined && d.dcs != null) {
          if (d.dcs == "0")
            postdata.msgType = 'Text';
          else if (d.dcs == "8")
            postdata.msgType = 'Unicode';
          else
            postdata.msgType = 'Binary';
        }

        this.ccapi.postData("SubscriberData/SendSMS", postdata).subscribe((resp: any) => {
          if (resp.code == "200" && resp.status == "success") {
            this.openDialog('success', 'Messsage Re-Send Successfully !');
          }
          else if (resp.code == "500" && resp.status == "error") {
            this.openDialog('error', resp.message);
          }
        });
      }
    });
  };

  openDialog(alert: string, text: string) {
    this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: text }
    });
  }

}



export class PageObject {
  public pageNo: number = 0;
  public pageSize: number = 10;
  public totalRecords: number = 0;
  public totalPages: number = 0;
}


export class OrderByObject {
  public ordercolumn: string = "";
  public direction: string = "";
}

