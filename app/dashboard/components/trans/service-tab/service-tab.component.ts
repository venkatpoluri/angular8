import { Component, OnInit, NgZone } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent, MatTableDataSource } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { HttpHeaders } from '@angular/common/http';
import { CcfactoryService } from '../../../../shared/services/ccfactory.service';
import { ProductdetailsComponent} from '../../trans/service-tab/product-details/product-details.component';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
declare var require: any;
var $ = require('jquery');
var dt = require('datatables.net');
var dd = require('datatables-fixedcolumns');
@Component({
  selector: 'app-service-tab',
  templateUrl: './service-tab.component.html',
  styleUrls: ['./service-tab.component.css'],
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
})
export class ServiceTabComponent implements OnInit {
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
  public getaccountinfo: any;
  public masters: any;
  public sp: any;
  public servicegroups: any;
  public servicegroup: any;
  public partners: any;
  public partner: any;
  public servicelist: any;
  public srchkey: any = "";
  public accountinfo: any;
  dataSource = new MatTableDataSource([]);
  isLoadingResults = true;
  displayedColumns: string[] = ["service_code", "name", "type", "servicegroup", "start_date", "end_date", "allowed_channels","actions"];
  orderByObject: OrderByObject = new OrderByObject();
  constructor(private spinner: NgxSpinnerService,private ccapiService: CcapiService, private router: Router, private dialog: MatDialog, private zone: NgZone, private ccFactory: CcfactoryService) {

  }

  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.getPage({ pageIndex: (this.pageObject.pageNo) });
    }
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.GetServices();
  }



  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;

    this.GetServices();
  }

  ngOnInit() {
    this.GetServiceGroups();
    this.GetAllServiceProviders();
    this.GetAccountInfo();
    setTimeout(() => {
      this.GetServices();
    }, 500);

    this.loginRole = this.ccapiService.getRole();
    //  this.GetRoles();
    // this.GetParentUserList();
    //this.ShowBusinessUnit();
    //this.GetUsersList();
    this.zone.runOutsideAngular(() => {
      window["manageuserrights"] = this.manageUserRights.bind(this);
    });
  }

  GetAllServiceProviders() {
    if (window.sessionStorage.getItem("ccare_spslist") != "undefined" && window.sessionStorage.getItem("ccare_spslist") != null && window.sessionStorage.getItem("ccare_spslist") != "[]") {
      this.serviceProvidersList = JSON.parse(window.sessionStorage.getItem("ccare_spslist"));
      this.sp = "2" + "";
      this.LoadPartners();
      return;
    }
    var postData = { userrole: parseInt('1010002'), username: "", pageno: 1, pagesize: 1000 };
    this.spinner.show();
    this.ccapiService.postData("user/GetParentUserList", postData).subscribe((response: any) => {
      this.spinner.hide();
      if (response.code == '200' && response.status == 'success') {
        this.serviceProvidersList = response.data;
        this.sp = "2" + "";
        window.sessionStorage.setItem("ccare_spslist", JSON.stringify(response.data));
        this.LoadPartners();
      }
      else {
        this.ccapiService.openDialog("error", "No service providers found...!");
      }
    });
  }

  GetServiceGroups() {
    if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
      this.masters = JSON.parse(sessionStorage.getItem("srvmasters"));
      this.servicegroups = this.masters.servicegroup;
      try {
        this.servicegroups = this.servicegroups.filter((element, index) => {
          return (element.id != "1038003");
        });

      } catch (e) { }
      if (this.servicegroups && this.servicegroups.length > 0) {
        //this.servicegroup = this.servicegroups[0].id;
        this.servicegroup = "1038006";
      }

      // this.language = this.masters.lang;
    }
  }

  LoadPartners() {
    if (this.servicegroup) {
      var _key = "partnerlist_" + this.servicegroup + "_" + this.sp;
      if (window.sessionStorage.getItem(_key) != null) {
        this.partners = JSON.parse(window.sessionStorage.getItem(_key));
        if (this.partners && this.partners.length > 0) {
          this.partner = "" + this.partners[0].partnerid;
          // IMIapp.unblockui();
          return;
        }
      }
      this.spinner.show();
      this.ccapiService.postData("service/GetPartnersByServiceGroup", { servicegroup: this.servicegroup, spid: this.sp }).subscribe((resp: any) => {
        this.spinner.hide();
        if (resp.code == "200" && resp.status == "success") {
          this.partners = resp.data;
          if (this.partners && this.partners.length > 0) {
            this.partner = "" + this.partners[0].partnerid;
            window.sessionStorage.setItem(_key, JSON.stringify(this.partners));

          }
          else {
            this.ccapiService.openDialog("error", "Partners not mapped for BU...!");
          }
          //IMIapp.unblockui();
        }
      });
    }
    else {
      this.ccapiService.openDialog("error", "Please Select Service Group...!");
      //IMIapp.unblockui();
    }
  }
  GetServices() {
    try {
      //IMIapp.blockui();
      try {
        if (this.partner == "" || this.partner == 0) {
          this.ccapiService.openDialog("error", "Please select partner...!");

          //IMIapp.unblockui();
          return;
        }
        //IMIapp.blockui("Getting Services");
        var _json = {};
        _json = {
          servicegroup: this.servicegroup,
          cpid: this.partner, spid: this.sp,
          pgno: this.pageObject.pageNo - 1, pgsize: this.pageObject.pageSize,
          srchkey: this.srchkey, userclass: this.accountinfo.subscriber.userType
        }
        this.spinner.show();
        this.ccapiService.postData("service/GetActiveServicesByPartner", _json).subscribe((response: any) => {
          this.spinner.hide();
          if (response.code == "500" && response.status == "error") {
            this.ccapiService.openDialog("warning", response.message);
            return;
          }
          else if (response.code == "200" && response.status == "success") {
            if (response && response.data) {
              this.dataSource = new MatTableDataSource(response.data);
              //this.pageObject.totalRecords = response.data.numFound;
              //this.pageObject.totalPages = response.data.numFound;
              this.servicelist = response.data;
              this.pageObject.totalRecords = response.data[0]["total"];
              this.pageObject.totalPages = Math.ceil(this.pageObject.totalRecords / this.pageObject.pageSize);
              this.isLoadingResults = false;
            }
            else {
              this.dataSource = new MatTableDataSource([]);
              this.pageObject.totalRecords = 0;
              this.pageObject.totalPages = 0;
              this.isLoadingResults = false;
            }
          }
          //if (resp.code == "200" && resp.status == "success") {
          //  this.servicelist = resp.data;
          //  if (this.servicelist != null && this.servicelist.length > 0) {
          //    this.total = this.servicelist[0]["total"];
          //    this.totalpages = Math.ceil(this.total / this.pgsize);
          //  }
          //  //  this.bindServices();
          //  // IMIapp.unblockui();
          //}
          //else {
          //  //toastrmsg('error', IMIapp.ShowJsonErrorMessage(resp));
          //  this.ccapiService.openDialog("error", "NA");
          //  // IMIapp.unblockui();
          //}
        });
      }
      catch (e) {
        this.ccapiService.openDialog("error", "Internal Error Unable to process your request");
        // IMIapp.unblockui();
      }
    }
    catch (e) {
      //IMIapp.unblockui();
      this.ccapiService.openDialog("error", "Internal Error Unable to process your request");
    }
  }

  GetAccountInfo() {
    var deferred = "";
    try {
      if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
        this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
        // deferred.resolve();
      }
      else {
        // IMIapp.blockui("Reloading Profile");
        this.spinner.show();
        this.ccapiService.postData("user/getaccountinfo", {}).subscribe((resp: any) => {
          this.spinner.hide();
          if (resp.data.code == "200" && resp.data.status == "success") {
            this.accountinfo = resp.data.data;
            if (this.accountinfo != undefined && this.accountinfo != null && this.accountinfo != '') {
              sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));
            }
            //IMIapp.unblockui();
            //deferred.resolve();
          }
          else {
            // toastrmsg('error', IMIapp.ShowJsonErrorMessage(resp));
            this.ccapiService.openDialog("error", "NA");
            //deferred.resolve();
          }
        });
      }

    }
    catch (e) {
      //      deferred.resolve();
    }
    //  return deferred.promise;
  }

  ngOnDestroy() {
    window["manageuserrights"] = null;
  }
  manageUserRights(userid: any) {
    this.router.navigate(["/dashboard/managerights/" + userid]);
  }
  ngAfterViewInit() {

    $('#subscription_grid').on("click", ".manageuserrights", function () {
      window["manageuserrights"]($(this).attr("data-id"));
    });
  }


  //public GetParentUserList() {
  //  var postData = { userrole: parseInt('1010002'), username: "", pageno: 1, pagesize: 1000 };
  //  this.ccapiService.postData("user/GetParentUserList", postData).subscribe((response: any) => {
  //    if (response.code == '200' && response.status == 'success') {
  //      this.serviceProvidersList = response.data;
  //      try {
  //        this.permission = response.permission;
  //      } catch (e) { }
  //    }
  //    else {
  //      this.openDialog('error', "No service providers found");
  //    }
  //  });
  //}

  public ShowBusinessUnit() {

    if (this.loginRole == '1010005') {
      this.showBU = "0";
      // buadmin = true;
    }
    else {

      if (this.userType == "1010003" || this.userType == "1010004" || this.userType == "1010005"
        || this.userType == "1010010" || this.userType == "1010012" || this.userType == "1010013"
        || this.userType == "1010014" || this.userType == "1010015" || this.userType == "1010016") {
        this.showBU = "1";
      }
      else {
        this.showBU = "0";
      }
    }
  }

  public GetRoles() {
    this.ccapiService.postData("master/UserRoles", {}).subscribe((response: any) => {
      if (response.code != null && response.code == "200") {
        this.userTypesList = [];
        let UploadusertypesList: any = [];
        this.userTypesList = response.data;
        UploadusertypesList = this.userTypesList;


      }
      else {
        alert(response.message);
        this.openDialog("error", "No this.usertypes found.");
      }
    }), (error => { console.log(error) });
  }
  //dispFixedCols() {
  //  if (1) {
  //    return {
  //      leftColumns: 1,

  //    };
  //  } else {
  //    return false;
  //  }

  //}
  toggle() {
    this.isOpen = !this.isOpen;
  }

  pagesizechange() {
    this.pageObject.pageNo = 1;
    //$scope.pgsize = 10;
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;
    this.GetServices();
  };

  openDialog(alert: string, text: string) {
    this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: text }
    });
  }

  serviceGroup(row): void {
    const dialogRef = this.dialog.open(ProductdetailsComponent, {
      data: { data: row},
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
}
export class PageObject {
  public pageNo: any = 1;
  public pageSize: any = 25;
  public totalRecords: any = 0;
  public totalPages: any = 0;
}
export class OrderByObject {
  public ordercolumn: string = "";
  public direction: string = "";
}
