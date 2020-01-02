import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from "../../../../shared/services/ccapi.service";
import { MatTableDataSource, MatDialog, MatSpinner, fadeInContent, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ServiceDetailsDialogComponent } from '../../trans/service-details-dialog/service-details-dialog.component';
import { Router } from '@angular/router';
import { UnsubServicesComponent } from './unsub-services/unsub-services.component';
import { CcfactoryService } from '../../../../shared/services/ccfactory.service';
 
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/shared/pipes/custompipes.pipe';
@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css'],
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
  ] 
})


export class SubscriptionsComponent implements OnInit, AfterViewInit {
   
  displayedColumns: string[] = ["select", "srvcCode", "sname","productname", "servicetype", "servicegroup", "actChannel", "servicestatus", "regOn", "actOn", "deactDate",
    "updatedOn", "validity", "inBnft", "renCycleCnt", "nextRenewal", "renewedOn", "lbPrice", "actions"];

  isOpen: any = true;
  //dataSource: any;
  //selection: SelectionModel<Element> = new SelectionModel<Element>(true, []);
  selection = new SelectionModel(true, []);
  isLoadingResults = true;
  pageObject: PageObject = new PageObject();
  showMenu: any;
  roleid: string;
  subscriptionsinfo: any[];
  accountinfo: any;
  subscriptions: any[];
  copysubscriptions: any[];

  masters: any;
  servicegroups: any[];
  channels: any[];
  srvstatus: any[];
  filters: any = { servicegroup : '', channel:'', status:''};

  dataSource: any = new MatTableDataSource(this.copysubscriptions);
  //dateObject: {
  //  startDate: any;
  //  endDate: any;
  //};

  toggle() {
    this.isOpen = !this.isOpen;
  }
  constructor(private spinner: NgxSpinnerService,private ccapi: CcapiService, private dialog: MatDialog, private router: Router, private ccfactory: CcfactoryService) {}
  handle(item) { alert(item); };

  @ViewChild(MatPaginator) paginator: MatPaginator;
   
  ngOnInit() {

   // $('.custom-style').find('.mat-paginator-navigation-previous, .mat-paginator-navigation-next').hide();

    if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
      this.masters = JSON.parse(sessionStorage.getItem("srvmasters"));
    }

    
    this.pageObject.pageNo =1;
    this.pageObject.pageSize = 25;
    this.pageObject.totalPages = 0;
    this.pageObject.totalRecords = 0;

    this.roleid = this.ccapi.getRole();
    this.getServiceGroups();
    this.getChannels();
    this.getServiceStatus();
    this.getaccountinfo();




    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      var _searchdata = JSON.parse(filter);
      return data.actChannel.toLowerCase().includes(_searchdata.channel);
    };
   
  }


  getDeactDate(row) {
    try {
      var _dtunsub = row["unsubDate"];
      var _unsubdate = row["unsubDate"];
      var _unsubmom = null;
      var _deactmom = null;
      if (_dtunsub && _dtunsub.length > 10) {
        _unsubmom = new CustomDateFormatPipe().transform(_dtunsub, '', '');
        //return _unsubmom;
      }
      var _deactdate = row["deactDate"];
      _dtunsub = row["deactDate"];
      if (_dtunsub && _dtunsub.length > 10) {
        _deactmom =  new CustomDateFormatPipe().transform(_dtunsub, '', '');
      }
      if (_unsubdate == null)
        _unsubdate = "";
      if (_deactdate == null)
        _deactdate = "";
      if (_unsubdate == "" && _deactdate != "")
        return _deactmom;
      else if (_deactdate == "" && _unsubdate != "")
        return _unsubmom;
      if (_unsubdate != "" && _deactdate != "") {
        if (_unsubdate > _deactdate)
          return _unsubmom;
        else
          return _deactmom;
      }
    } catch (e) {
    }
    return "";
  };

  getNextRenewalDate(row, key) {
    if (row.servicetype == "3")
      return row.autoRenewal == true ? new CustomDateFormatPipe().transform(row[key], '', '') : "";
    else {
      try {
        if (row["parentSId"] != null && row["parentSId"] != undefined && row["parentSId"] != "0") {
          try {
            var bndl = this.copysubscriptions.filter(function (item, index) {
              return (item.serviceId == row["parentSId"]);
            })[0];
            if (bndl.autoRenewal) {
              return "";
            }

          } catch (e) { }
        }
      } catch (e) { }
      return new CustomDateFormatPipe().transform(row[key], '', '');
    }
  }

  //changePageSize(pagesize: number) {
  //  this.pageObject.pageSize = pagesize;
  // // this.gettransactions();
  //}



  applyFilter() {

    this.dataSource.filter = JSON.stringify(this.filters);
  }

  

  unsubscribeservices() {
    var selectedrows = [];

    if (this.selection.selected)
      selectedrows = this.selection.selected.filter(function (item) {
      return item.hasactiveservice;
    });


    const dialogRef = this.dialog.open(UnsubServicesComponent, {
      data: { subscriptions: this.subscriptionsinfo, selectedrows: selectedrows } 
    });
  };
 

  ngAfterViewInit() { }

 
  getServiceGroups() {
    try {
      this.ccfactory.getServiceGroups().then((res: any) => {
        this.servicegroups = res;
      });
      
    }
    catch (e) { }
  }

  getChannels() {
    try {
      this.ccfactory.getChannels().then((res: any) => {
        this.channels = res;
      });

    }
    catch (e) { }

     
  }

  getServiceStatus() {

    try {
      this.ccfactory.getServiceStatus().then((res: any) => {
        this.srvstatus = res;
      });

    }
    catch (e) { }
  }


  getfilterdata() {
    this.isLoadingResults = true;
    try {
      this.copysubscriptions = this.subscriptions.filter(function (element, index) {
        return (element.servicestatus.toString() == this.filters.status);
      });
      this.dataSource = new MatTableDataSource(this.copysubscriptions);

      this.isLoadingResults = false;
    }
    catch (e) { }
  };

  getaccountinfo() {
    this.isLoadingResults = true;
    if (sessionStorage.getItem("ccaresubmenupermission") != null && sessionStorage.getItem("ccaresubmenupermission") != '') {
      this.showMenu = JSON.parse(sessionStorage.getItem("ccaresubmenupermission"));
    }
    if (this.roleid == "1010012" || this.roleid == "1010005") {
      if (this.showMenu != undefined && this.showMenu != null && this.showMenu.subscriptions == 0) {
        
        this.router.navigate(["/dashboard/accountinfo"]);
      }
    }
    else {
      this.router.navigate(["/dashboard/subscriptions"]);
    }


    this.subscriptionsinfo = [];
    if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
      this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
    }
    if (this.accountinfo != null && this.accountinfo.subscriptions != null) {
      this.subscriptionsinfo = this.accountinfo.subscriptions;
      this.subscriptions = this.accountinfo.subscriptions;
      if (this.subscriptions != undefined && this.subscriptions.length > 0) {
        //this.shownunsubbtn = true;
        this.pageObject.totalRecords = this.subscriptions.length;
        var _scodelist = '';
        for (var i = 0; i < this.subscriptions.length; i++) {
          _scodelist += this.subscriptions[i].srvcCode + ",";
        }

        this.getServicesByCode(_scodelist, 'srvcCode');
      }
    }

  };


  getServicesByCode(_scodelist, srvcCode) {
    this.spinner.show();
    this.ccapi.postData('Service/getserviceinfobyservicecode', { servicecode: _scodelist }).subscribe((response: any) => {
      this.spinner.hide();
      if (response.code == "500" && response.status == "error") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status == "success") {
        var subscriptions = this.subscriptions;

        for (var i = 0; i < subscriptions.length; i++) {
          subscriptions[i].sname = "";
          subscriptions[i].productname = "";
          subscriptions[i].servicestatus = "";
          if (subscriptions[i].servicegroup == null || subscriptions[i].servicegroup == undefined)
            subscriptions[i].servicegroup = "";
          subscriptions[i].provider_id = "";
          subscriptions[i].providername = "";
          subscriptions[i].refundtype = "";
          subscriptions[i].cbsservicetypeid = "";
          subscriptions[i].cbsservicetypename = "";
          subscriptions[i].usagetypeid = "";
          subscriptions[i].hasactiveservice = false;

          if (subscriptions[i].state != '-1' && subscriptions[i].state != '11' && subscriptions[i].state != '9') {
            subscriptions[i].hasactiveservice = true;
          }

          subscriptions[i].refundpartialallowed = "0";
                var data = response.data.filter(function (element, index) {
                  return (element.service_code == subscriptions[i][srvcCode]);
            })[0];
 
          if (data != null && data.sid != null && data.sid != undefined) {
            subscriptions[i].sid = data.sid;
            subscriptions[i].sname = data.sname;
            subscriptions[i].servicestatus = data.state;
            subscriptions[i].servicegroup = data.servicegroup;
            subscriptions[i].provider_id = data.provider_id;
            subscriptions[i].providername = data.providername;
            try {
              subscriptions[i].refundtype = data.refundtype;
            }
            catch (e) { }
            try {
              subscriptions[i].servicetype = data.type;
            }
            catch (e) { }
            try {
              subscriptions[i].cbsservicetypeid = data.serviceext.cbsservicetypeid;
              subscriptions[i].cbsservicetypename = data.serviceext.cbsservicetypename;
              subscriptions[i].usagetypeid = data.serviceext.usagetypeid;
            }
            catch (e) { }
          }
          else { //Based on Service Object
                var data = response.data.filter(function (element, index) {
              return (element.servicecode == subscriptions[i][srvcCode]);
            })[0];
            if (data != null) {
              subscriptions[i].servicesensitivity = data.sensitivity;
              subscriptions[i].message_act = subscriptions[i].message + "";
              subscriptions[i].sid = data.serviceid;
              subscriptions[i].sname = data.servicename;
              subscriptions[i].servicestatus = data.status;
              subscriptions[i].servicegroup = data.servicegroup;
              subscriptions[i].provider_id = data.partnerid;
              subscriptions[i].providername = data.partnername;
              try {
                if (data.refund != null && data.refund.refundsource != null)
                  subscriptions[i].refundtype = data.refund.refundsource;
                if (data.refund != null && data.refund.refundtype != null) {
                  if (data.refund.refundtype == "3")
                    subscriptions[i].refundpartialallowed = "1";
                }
              }
              catch (e) { }
              try {

                if (data.sensitivity == "2" || data.sensitivity == "3") {
                  subscriptions[i].message = "****";
                }

              } catch (e) { }
              try {
                var _code = subscriptions[i].chargecode;
                if (_code == null || _code == undefined || _code.length < 10) {
                  _code = subscriptions[i].cCode;
                }
                if (_code == null || _code == undefined || _code.length < 10) {
                  _code = subscriptions[i].reqChrgCode;
                }
                if (_code != null && _code != undefined && _code.length > 10) {
                  if (data.subscriptionplans != null && data.subscriptionplans.length > 0) {

                    var _prod = data.subscriptionplans.filter(function (sc) {
                      return sc.chargecode == _code;
                      });
                     
                    if (_prod != null && _prod != undefined && _prod.length > 0) {
                      subscriptions[i].productname = _prod[0].name;
                    }
                  }
                  else if (data.payperuseplans != null && data.payperuseplans.length > 0) {

                    var _prod = data.payperuseplans.filter(function (pp) {
                      return pp.chargecode == _code;
                    });
                     
                    if (_prod != null && _prod != undefined && _prod.length > 0) {
                      subscriptions[i].productname = _prod[0].name;
                    }
                  }
                }
              } catch (e) { }
              try {
                subscriptions[i].servicetype = data.servicetype;
              }
              catch (e) { }
              try {
                subscriptions[i].cbsservicetypeid = data.serviceext.cbsservicetypeid == null ? "" : data.serviceext.cbsservicetypeid;
                subscriptions[i].cbsservicetypename = data.serviceext.cbsservicetypename == null ? "" : data.serviceext.cbsservicetypename;
                subscriptions[i].usagetypeid = data.serviceext.usagetypeid == null ? "" : data.serviceext.usagetypeid;
              }
              catch (e) { }

            }
          }
        }
         
        try {

          this.copysubscriptions = JSON.parse(JSON.stringify(this.subscriptions));
         // var _dataSource = this.subscriptions.slice(0, this.pageObject.pageSize);
          this.dataSource = new MatTableDataSource(this.copysubscriptions);
          this.dataSource.paginator = this.paginator;


          this.isLoadingResults = false;
         // window.sessionStorage.setItem("operm", JSON.stringify(response.data.permission));
        } catch (e) { }
      }
      else {
        alert();
      }
    });
  };

  //isChecked(row: any): boolean {
  //  const found = this.selection.selected.find(el => el.productId === row.productId);
  //  if (found) {
  //    return true;
  //  }
  //  return false;
  //}

  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.dataSource = this.subscriptions.slice(this.pageObject.pageNo * this.pageObject.pageSize - this.pageObject.pageSize, this.pageObject.pageNo * this.pageObject.pageSize);
      
      //this.selection.isSelected = this.isChecked.bind(this);
    }
  }

 
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

}



export class PageObject {
  public pageNo: number = 1;
  public pageSize: number = 50;
  public totalRecords: number = 0;
  public totalPages: number = 0;
}


export interface Filters {
  status: string;
}


 

