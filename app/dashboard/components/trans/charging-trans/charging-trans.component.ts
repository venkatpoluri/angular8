import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from "../../../../shared/services/ccapi.service";
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { ServiceDetailsDialogComponent } from '../../trans/service-details-dialog/service-details-dialog.component';
import { CcfactoryService } from '../../../../shared/services/ccfactory.service';
import { SelectionModel } from '@angular/cdk/collections';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
//import messageTrans from '../campaign-trans/campaign-trans.json';
import { NgxSpinnerService } from 'ngx-spinner';
const moment = (_moment as any).default ? (_moment as any).default : _moment;
import { CustomDateFormatPipe } from 'src/app/shared/pipes/custompipes.pipe';
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component';

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
  selector: 'app-charging-trans',
  templateUrl: './charging-trans.component.html',
  styleUrls: ['./charging-trans.component.css'],
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


export class ChargingTransComponent implements OnInit, AfterViewInit {

  public dateTime = new moment();
  displayedColumns: string[] = ["select", "serviceid", "servicename", "productname_es", "service_type", "servicegroup", "trans_type", "sourcechannel",
    "originating_timestamp", "charge_status", "requested_price", "charged_price", "tax_amount", "debt_amount", "refund_amount", "refund_status", "remarks","cdesc","actions"];

  isOpen: any = true;
  dataSource: any;
  isLoadingResults = true;
  servicegroups: any[];
  filters: any = { servicegroup: ''};

  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  selection = new SelectionModel(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isDOBgroupRefund: number = 0;
  ischildrequest: boolean = false;
  accountinfo: any;
  trans: any[];

  refundobject = {
    totalcharged: '0', requestedrefund: '0', excludetax: '0', vatrefund: '0', refundtype: '1',
    refundreasoncode: '',
    refundcategory: "1", refundstatus: "", remarkscode: "", remarksreason: "", comments: "",
    refundInfo: [], refundcodeid: "", chargedon: ""
  }

  dateObject: {
    startDate: any;
    endDate: any;
  };

  refundworktrans = [];


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
  constructor(private spinner: NgxSpinnerService,private ccapi: CcapiService, private dialog: MatDialog, private ccfactory: CcfactoryService) {
    this.dateObject = {
      startDate: new moment().subtract(11, 'days').startOf('day'),
      endDate: new moment().endOf('day')
    }

  }

  showrefundcheckbox(row) {
    try {
      var $scope = this;
        // var _tmp = "t_" + row["gtrid"];
        var chargeprc = '';
        try {
          chargeprc = row["charged_price"];
          if (chargeprc == "" || chargeprc == "0")
            return false;
        }
        catch (e) { }
        if (row["service_refund_enabled"] != null && row["service_refund_enabled"] != undefined
          && row["service_refund_enabled"] == "1"
          && (row["refund_source"] == "2" || row["refund_source"] == "3")) {
          var _showrefund = false;
          try {
            var _uchargeprice = parseFloat(row["charged_price"]);
            var _urefundprice = parseFloat(row["refund_amount"]);
            var _udebt = parseFloat(row["debt_amount"]);
            var _refamount = 0;
            _refamount = _uchargeprice - _udebt - _urefundprice;
            if (_refamount < 0)
              _refamount = 0;
            row["refundprice_charged_price"] = _refamount;
            _showrefund = true;
          } catch (e) { }

          var _pending = null;
          if ($scope.refundworktrans != null && $scope.refundworktrans != undefined &&
            $scope.refundworktrans.length > 0) {
            _pending = $scope.refundworktrans.filter(function (item) {
              return (item.vcgrtid == row["gtrid"]);
            });
            if (_pending != null && _pending != undefined && _pending.length > 0
              && _pending[0].vcgrtid != null) {
              _showrefund = false;
              try {
                var _pp = row["refundprice_charged_price"];
                _pp = parseFloat(_pp) - parseFloat(_pending[0].drefundamount);
                if (_pp > 0) {
                  row["refundprice_charged_price"] = _pp;
                }
              } catch (e) { }
              row["refundstatus"] = "-1000";
            }
          }
           
          if (_showrefund) {
            row["refundenabled"] = "1";
            return true;
          }
        }
        else {
          return false;
        }
      
    }
    catch (e) { }
    return false;
  }

  getaccountinfo() {
    var $scope = this;
    $scope.isLoadingResults = true;
    if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
      $scope.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
    }

    if ($scope.accountinfo != null) {
      //try {
        //if (this.accountinfo.subscriber.state == "4")
          //this.permission.moderate = "0";
      //} catch (e) { }
      $scope.getpendingrefundtrans();
      setTimeout(function () {
        $scope.getPage({ pageIndex: ($scope.pageObject.pageNo), pageSize: $scope.pageObject.pageSize });
      }, 2000);

    }
   // else {
      //this.ccfactory.GetAccountInfo().then(function (resp) {
      //  if (resp.data.code == "200" && resp.data.status == "success") {
      //    this.accountinfo = resp.data.data;
      //    if (this.accountinfo != undefined && this.accountinfo != null && this.accountinfo != '') {
      //      sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));
      //    }
      //  }
      //});
    //}
  };



  getpendingrefundtrans() {
    try {
      this.refundworktrans = [];
      var $scope = this;
      var _refundkeysession = "ref_" + $scope.accountinfo._id + "_" + this.dateObject.startDate.format().replace("", "_").replace("", "_") + "_" + this.dateObject.endDate.format().replace("", "_").replace("", "_");
      if (!window.sessionStorage.getItem(_refundkeysession)) {
        var _postjson =
        {
          startdate: new CustomDateFormatPipe().transform(moment().add(-360, 'day'), '', 'YYYY-MM-DD 00:00'),
            enddate: new CustomDateFormatPipe().transform(moment().add(1, 'day'), '', 'YYYY-MM-DD 23:59'),
          status: "1",
          msisdn: $scope.accountinfo._id,
          usertype: "0",
          refundsource: "0"
        };

        this.ccapi.postData("subscriberdata/GetRefundRequestsByDate", _postjson).subscribe((resp: any) =>  {
          if (resp.data.code == "200" && resp.data.status == "success") {
            $scope.refundworktrans = resp.data.data;
            if ($scope.refundworktrans != null && $scope.refundworktrans.length > 0)
              window.sessionStorage.setItem(_refundkeysession, JSON.stringify(resp.data.data));
          }
        });
      }
      else {
        $scope.refundworktrans = JSON.parse(window.sessionStorage.getItem(_refundkeysession));
      }
    } catch (e) { }
  }

  FormRefundList = function (action) {
    var $scope = this;
    $scope.isDOBgroupRefund = 0;
    try {
      if ($scope.ischildrequest == false) {
        $scope.refundobject.totalcharged = 0;
        $scope.refundobject.requestedrefund = 0;
        $scope.refundobject.excludetax = 0;
       // $scope.setReasonMasters();
        $scope.selecteditems = [];
        $scope.anyinvaliditems = false;

        var selectedrows = this.selection.selected;
        //if (this.selection.selected)
        //  selectedrows = this.selection.selected.filter(function (item) {
        //    return item.hasactiveservice;
        //  });


        for (let item of selectedrows) {
          var datalist = $scope.trans.filter(function (cur) {
              return cur.gtrid == item.gtrid;
            });
            if ($scope.currenttab == 'service') {
              datalist = $scope.trans.filter(function (cur) {
                return cur.chargecode == item.chargecode;
              });
            }
            if (datalist != null && datalist.length > 0) {

              for (var ii = 0; ii < datalist.length; ii++) {
                var data = datalist[ii];
                if (data != null) {
                  /// In case of null
                  if (data.charged_price == "")
                    data.charged_price = "0";
                  if (data.charged_price != '0') {

                    if (data.refundamount == "")
                      data.refundamount = "0";
                    if (data.tax_amount == "")
                      data.tax_amount = "0";
                    var _partial = item.gtrid;
                    if (_partial != null && _partial != "") {
                      data.refundamount = parseFloat(_partial);
                    }
                    else
                      data.refundamount = data.charged_price;

                    if (parseFloat(data.refundamount) > parseFloat(data.charged_price)) {
                      $scope.ccapi.openDialog("error", "Refund Price should not be greater than charged price.");
                      $scope.anyinvaliditems = true;
                      return;
                    }
                    try {
                      if (parseFloat(data.charged_price) > 0 && parseFloat(data.refundamount) > 0
                        && parseFloat(data.refundamount) > parseFloat(data.charged_price)) {
                        $scope.ccapi.openDialog("error", "Refund Price should not be greater than allowed refund price.");
                        $scope.anyinvaliditems = true;
                        return;
                      }

                    } catch (e) { }

                    $scope.selecteditems.push(data);
                    $scope.refundobject.totalcharged += parseFloat(data.charged_price);
                    $scope.refundobject.requestedrefund += parseFloat(data.refundamount);
                    $scope.refundobject.excludetax += parseFloat(data.tax_amount);

                    break;
                  }
                }
              }
            }
         
        } 
        if ($scope.anyinvaliditems == true) { return; }
      }
      $scope.FormRefundArray(action);
    }
    catch (e) {

      console.log(e);
    }
    return true;
  }

  FormRefundArray = function (action) {

    $scope.isDOBgroupRefund = 0;
    try {
      var $scope = this;
      //$scope.setReasonMasters();

      if ($scope.selecteditems.length == 0) {
        $scope.ccapi.openDialog('error', "Please select refund transactions");
        return;
      }
      if ($scope.refundobject.totalcharged == 0) {
        $scope.ccapi.openDialog('error', "Total charged value is less than 0. Please select valid transaction");
        return;
      }

      if ($scope.selecteditems.length > 0) {
        $scope.refundobject.refundInfo = [];
        for (var i = 0; i < $scope.selecteditems.length; i++) {
          var _srvdata = {
            "serverReferenceCode": $scope.selecteditems[i].gtrid,
            "serviceIdentifier": $scope.selecteditems[i].serviceid,
            "productIdentifier": $scope.selecteditems[i].chargecode != undefined ? $scope.selecteditems[i].chargecode : "",
            "refundAmount": $scope.selecteditems[i].refundamount,
            "refundDescription": $scope.refundobject.comments,
            "refundReason": $scope.selecteditems[i].refundreason,
            "refundReasonCode": $scope.selecteditems[i].refundreasoncode,
            "refundCatgCode": $scope.selecteditems[i].refundcatgcode,
            "unsubscribe": action == "refundunsub" ? "1" : "0",
            refundstartdate: $scope.startdate,
            refundenddate: $scope.enddate,
            "servicename": $scope.selecteditems[i].servicename,
            "productname": $scope.selecteditems[i].productname_es
          }
          try {
            if (_srvdata.productIdentifier == "") {
              _srvdata.productIdentifier = $scope.selecteditems[i].chargecode_es != undefined ? $scope.selecteditems[i].chargecode_es : ""
            }
          } catch (e) { }
          try {
            if ($scope.currenttab == 'trans') {
              _srvdata.refundstartdate = moment($scope.selecteditems[i].originating_timestamp).format("YYYY-MM-DD HH:mm:ss");
              _srvdata.refundenddate = moment($scope.selecteditems[i].originating_timestamp).format("YYYY-MM-DD HH:mm:ss");
            }
          } catch (e) { }
          if ($scope.showrefundselection) {
            //_srvdata.refundReason = $scope.refundobject.refundreasoncode;
            _srvdata.refundReasonCode = $scope.refundobject.refundreasoncode;
            _srvdata.refundReason = $scope.refundobject.remarksreason;
          }
          $scope.refundobject.refundInfo.push(_srvdata);
        }

        const dialogRef = this.dialog.open(RefundDialogComponent, {
          //data: { servicecode: d.status_code },
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
      else {
        $scope.ccapi.openDialog('error', "Please select Services");
      }
    }
    catch (e) {

      console.log(e);
    }
    return true;
  }

  //setReasonMasters = function () {
  //  $scope.remarkscodelist = [];
  //  $scope.refundcategory = [];
  //  $scope.reasonmaster = [];
  //  var _tmp = [];
  //  for (var i = 0; i < $scope.refundmaster.length; i++) {
  //    if (_tmp.indexOf($scope.refundmaster[i].vcreasoncode) == -1
  //      && $scope.refundmaster[i].vcreasoncode.length > 1) {
  //      $scope.reasonmaster.push($scope.refundmaster[i]);
  //      //_tmp.push($scope.refundmaster[i].vcreasoncode);
  //    }
  //  }
  //  if ($scope.reasonmaster != undefined && $scope.reasonmaster.length > 0) {
  //    $scope.refundobject.refundreasoncode = $scope.reasonmaster[0].vcreasoncode;
  //    $scope.refundobject.refundcodeid = $scope.reasonmaster[0].vcreason;
  //  }
  //  $scope.setRefundType();
  //}

  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = (page - 1);
      this.getPage({ pageIndex: (this.pageObject.pageNo) });
    }
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.gettransactions();
  }
  
  changePageSize(obj) {
     
    this.pageObject.pageSize = obj.pageSize;
    this.gettransactions();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;

    this.gettransactions();
  }


  getServiceGroups() {
    try {
      this.ccfactory.getServiceGroups().then((res: any) => {
        this.servicegroups = res;
      });

    }
    catch (e) { }
  }



  ngOnInit() {
    this.getServiceGroups();
    this.pageObject.pageNo = 1;
    this.pageObject.pageSize = 10;
    this.pageObject.totalPages = 0;
    this.pageObject.totalRecords = 0;

    this.orderByObject.ordercolumn = "";
    this.orderByObject.direction = "";
    //this.getPage({ pageIndex: (this.pageObject.pageNo), pageSize: this.pageObject.pageSize });

    this.getaccountinfo();
    
  }

  ngAfterViewInit() { }


  gettransactions() {
    this.isLoadingResults = true;
    let requesrParams = {
      parentid: "",
      username: "",
      userrole: 0,
      //filters: this.filters,
      servicegroup: this.filters.servicegroup,
      startdate: this.dateObject.startDate.format('YYYY-MM-DD HH:mm').toString(),
      enddate: this.dateObject.endDate.format('YYYY-MM-DD HH:mm').toString(),
      pageno: (this.pageObject.pageNo-1) * this.pageObject.pageSize, // (this.pageObject.pageNo * this.pageObject.pageSize) + 1,
      pagesize: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      order: this.orderByObject.direction,

    }
    this.spinner.show();
    this.ccapi.postData('subscriberdata/GetChargingTranstions', requesrParams).subscribe((response: any) => {
      //response = messageTrans;  //TEMP
      this.spinner.hide();
      if (response.code == "500" && response.status == "error") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status == "success") {
        if (response && response.data && response.data.transactions) {
          this.trans = response.data.transactions;
          for (var i = 0; i < this.trans.length; i++) {

          }
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

