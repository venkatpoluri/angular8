import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from "src/app/shared/services/ccapi.service";
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { ServiceDetailsDialogComponent } from 'src/app/dashboard/components/trans/service-details-dialog/service-details-dialog.component';

import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_FORMATS } from 'ng-pick-datetime-moment';
import { CustomDateFormatPipe } from '../../../shared/pipes/custompipes.pipe';
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
  selector: 'app-bulkprovision',
  templateUrl: './bulkprovision.component.html',
  styleUrls: ['./bulkprovision.component.css'],
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


export class BulkprovisionComponent implements OnInit, AfterViewInit {

  public roleid: any = "";
  public UserTypesList: any[] = [];
  public Userslist: any[] = [];
  public usertype: any = "";
  public status: any = "6";
  public fullmessage: any = "";

  public provisionList: any;
  public permission: any;
  public provision: any;
  public files: any;
  public counts: any;
  public dateTime = new moment();
  displayedColumns: string[] = ["id", "name", "type", "charging", "uploadedby", "createddate", "status"];

  isOpen: any = true;
  dataSource: any;
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
    this.LoadProvisions();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;

    this.LoadProvisions();
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
    this.LoadProvisions()
    //this.ChangeUsertype(this.usertype);
  }

 

  ngAfterViewInit() { }


  LoadProvisions() {
    this.isLoadingResults = true;

    let requesrParams = {
      "status": this.status,
      startdate: this.dateObject.startDate.format('YYYY-MM-DD HH:mm').toString(),
      enddate: this.dateObject.endDate.format('YYYY-MM-DD HH:mm').toString(),
      pageno: (this.pageObject.pageNo * this.pageObject.pageSize) + 1,
      pagesize: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      order: this.orderByObject.direction,
    }
    this.ccapi.postData('master/getbulkprovisions', requesrParams).subscribe((response: any) => {
      //response = apiresponse;

      if (response.code == "500" && response.status == "error") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status == "success") {
        if (response && response.data) {
          this.provisionList = response.data;
          this.permission = response.permission;
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

        $('#provision_grid').off('click').on('click', 'a.rowedit', function () {
          if ($(this).hasClass('rowedit')) {
            var id = this.id;
            //var item = $.grep(this.auditlogslist, function (vitem) {
            //  return vitem.logid == id;
            //})[0];
            var recordDetails = this.provisionList.filter((element, index) => {
              return (element.id == id);
            })[0];
            this.ShowProvision(recordDetails.id);
          }
          else if ($(this).hasClass('counts')) {
            var id = this.id;
            this.ShowCounts(id);
          }
          else if ($(this).hasClass('downloadfailues')) {
            var id = this.id;
            this.DownloadBulkFailures(id);
          }
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

  ShowProvision(id: string) {
    this.ccapi.postData("master/getbulkprovisiondetails", { "id": id }).subscribe((response: any) => {

      if (response.code == '200' && response.status == 'success') {
        this.provision = response.data.data;
        this.provision.startdate = new CustomDateFormatPipe().transform(this.provision.startdate, 'mm/dd/yyyy HH:mm:ss', "YYYY-MM-DD H:mm:ss");
          //IMIapp.GetformatedDate(this.provision.startdate, 'mm/dd/yyyy HH:mm:ss', "YYYY-MM-DD H:mm:ss");
        this.provision.enddate = new CustomDateFormatPipe().transform(this.provision.enddate, 'mm/dd/yyyy HH:mm:ss', "YYYY-MM-DD H:mm:ss");
       //   IMIapp.GetformatedDate(this.provision.enddate, 'mm/dd/yyyy HH:mm:ss', "YYYY-MM-DD H:mm:ss");
        this.provision.filesource = "1";
        var arr = this.provision.filepath.split('/');
        this.files = arr[arr.length - 1];
      //  $('#addprovision').modal('show');
      }
      else {
        this.ccapi.openDialog("error", "Dear User, Error occurred while processing your request...!");
        //toastrmsg('error', "Dear User, Error occurred while processing your request");
        return;
      }
    });
  }

 ShowCounts(id:any) {
  try {
    this.counts = { total: '', success: '', failed: '' };
    var item = this.provisionList.filter((vitem)=> {
      return vitem.id == id;
    })[0];

    this.counts = { name: item.name, total: item.totalcount, success: item.successcount, failed: item.failedcount };
  //  $('#CountsModal').modal('show');
    //this.$apply();
  }
  catch (e) { }
  };

  DownloadBulkFailures(id: any) {
    this.ccapi.postData("auth/DownloadBulkFailures", { id: id }).subscribe((resp:any) => {
      if (resp == null || resp.data == null || resp.data.code != '200') {
      //  toastrmsg('error', resp.data);
       // IMIapp.unblockui();
      }
      else {
        var _url = '';
        _url = this.ccapi.ApiUrl("auth/downloadfiles/" + (resp.data.data));

        var popUp = window.open(_url);
        if (popUp == null || typeof (popUp) == 'undefined') {
          //toastrmsg('error', 'Please disable your pop-up blocker and "download" again.');
        }
        else {
          popUp.focus();
        }
        //IMIapp.unblockui();
      }
    });
  }


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


