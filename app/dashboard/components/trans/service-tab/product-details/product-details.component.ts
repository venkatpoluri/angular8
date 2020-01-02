import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { CcapiService } from 'src/app/shared/services/ccapi.service';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent, MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { MsgdialogueboxComponent } from 'src/app/shared/msgdialoguebox/msgdialoguebox.component';
import { ConfirmDialogueBoxComponent } from '../../../../../shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { planSubStatus, planUserStatus, GetProductTypes } from 'src/app/shared/models/enums.model';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductdetailsComponent implements OnInit {
  Date = new Date();
  public pageObject: PageObject = new PageObject();
  dataSource: any;
  isLoadingResults = true;
  // displayedColumns: string[] = ["productid", "name", "chargecode", "pricemodel", "activationprice", "duration", "unsubscriptionmode","actions","status"];
  displayedColumns: string[] = ["productid", "name", "subsctiontype", "pricemodel", "activationprice", "duration", "unsubscriptionmode", "actions", "productsubstatus"];
  orderByObject: OrderByObject = new OrderByObject();
  public permission: any;
  public servicecode: string;
  public loginRole: any;
  public servicedetails: any;
  public productInfo: any;
  public productList: any = [];
  public useractiveproduct: any;
  public migrationProduct: any;
  public serviceproducts: any = [];
  public serviceobject: any;
  public accountinfo: any;
  public subscriptions: any;
  public currency: any;


  public _json: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ccapiService: CcapiService, private router: Router, private dialog: MatDialog, private zone: NgZone, private dialogRef: MatDialogRef<ProductdetailsComponent>) {
    if (data.data && data.data.sid)
      this.servicecode = data.data.sid;
    this.serviceobject = {
      srvcCode: data.data.service_code, serviceId: data.data.sid, transtype: 0, chargecode: ""
    };

    this.servicedetails = {};
  }

  close() {
    this.dialogRef.close('');
  }



  ngOnInit() {
    this.pageObject.pageNo = "1";
    this.pageObject.pageSize = "10";
    this.pageObject.totalPages = "0";
    this.pageObject.totalRecords = "0";
    var _currency = this.ccapiService.GetCurrencyCode;
    this.currency = (!_currency && _currency == null) ? '&nbsp;(&#3647;)' : '&nbsp;(' + _currency + ')';
    this.currency = "";



    this.loginRole = this.ccapiService.getRole();
    this.GetAccountInfo();
    if (this.accountinfo != undefined && this.accountinfo != null
      && this.accountinfo.subscriptions != undefined && this.accountinfo.subscriptions != null) {
      this.subscriptions = this.accountinfo.subscriptions;
    }
    this.GetServiceInfo();

  }

  //this.servicedetails = response.data;
  myresponse: any;

  GetAccountInfo() {
    try {
      if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
        this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
      }
      else {
        //IMIapp.blockui("Reloading Profile");
        this.ccapiService.postData("user/getaccountinfo", {}).subscribe((resp: any) => {
          if (resp.code == "200" && resp.status == "success") {
            this.accountinfo = resp.data.data;
            if (this.accountinfo != undefined && this.accountinfo != null && this.accountinfo != '') {
              sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));
            }
            //   IMIapp.unblockui();
          }
          else {
            this.ccapiService.openDialog("error", "Internal Error Unable to process your request");
            //toastrmsg('error', IMIapp.ShowJsonErrorMessage(resp));
          }
        });
      }

    }
    catch (e) { }
  }

  public GetServiceInfo() {
    var sid = this.serviceobject.serviceId;
    var obj = this.serviceobject;
    var _sk = "servicedet_temp_" + sid;
    if (sessionStorage.getItem(_sk) != null && sessionStorage.getItem(_sk) != '') {
      this.servicedetails = JSON.parse(sessionStorage.getItem(_sk));
      // deferred.resolve();
    }
    else {
      var postData = { ServiceID: this.servicecode };
      this.ccapiService.postData("service/GetServiceInfo", postData).subscribe((response: any) => {
        if (response.code == "500" && response.status == "error") {
          this.ccapiService.openDialog("warning", response.message);
          return;
        }
        else if (response.code == "200" && response.status == "success") {
          if (response && response.data) {
            // this.dataSource = new MatTableDataSource(response.data.subscriptionplans);
            this.productList = response.data.subscriptionplans;
            this.servicedetails = response.data;
            //this.pageObject.totalRecords = response.data.numFound;
            //this.pageObject.totalPages = response.data.numFound;
            //this.pageObject.totalRecords = response.data[0]["total"];
            //this.pageObject.totalPages = Math.ceil(this.pageObject.totalRecords / this.pageObject.pageSize);
            this.isLoadingResults = false;
            this.BindServiceInfo();
          }
          else {
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.pageObject.totalPages = 0;
            this.isLoadingResults = false;
          }
        }
      });
    }

    this.BindServiceInfo();

  }

  BindServiceInfo() {
    var _plan = this.servicedetails.subscriptionplans;
    if (String(this.servicedetails.servicetype) == '1')
      _plan = this.servicedetails.payperuseplans
    if (this.serviceobject.chargecode != null && this.serviceobject.chargecode != undefined && this.serviceobject.chargecode.length > 10) {
      // this.bindProductInfo();
      return;
    }
    try {
      _plan = _plan.filter((element, index) => {
        return element.status == 1;
      }
      );
      if (_plan == null || _plan == undefined)
        _plan = [];
    } catch (e) { }

    try {

      this.serviceproducts = [];
      for (var i = 0; i < _plan.length; i++) {
        _plan[i].showactivation = false;
        _plan[i].showunsub = false;
        _plan[i].statusdesc = "";
        _plan[i].userstatus = "-1000";
        _plan[i].productsubstatus = "0";
        try {
          var _grepplan = null;
          if (this.subscriptions != null && this.subscriptions != undefined) {
            _grepplan = this.subscriptions.filter((element, index) => {
              return element.reqChrgCode == _plan[i].chargecode;
            }
            );

          }
          if (_grepplan != null && _grepplan != undefined) {
            _plan[i].userstatus = _grepplan.state;
            try {
              _plan[i].productsubstatus = _grepplan.subStatus;
            } catch (e) { }
            if (_grepplan.state != "0") {
              if (_grepplan.state != "11" && _grepplan.state != "9") {
                _plan[i].showunsub = false;

              }
              else {
                _plan[i].showunsub = true;
                this.useractiveproduct = _grepplan;
              }
            }
            else {
              if (_grepplan.state == "0")
                _plan[i].showactivation = true;
            }
            try {
              if ((_grepplan.state == "11" || _grepplan.state == "9"
              )
                && (_plan[i].productsubstatus == "0")) {
                _plan[i].showactivation = true;
              }
            } catch (e) { }
            _plan[i].statusdesc = planUserStatus[_grepplan.state];
            //              IMIapp.getplanuserstatus(_grepplan.state);
          }
          else {
            _plan[i].showactivation = true;
          }

          //SERVICE TYPE
          if (String(this.servicedetails.servicetype) == "1") {
            _plan[i].producttype = GetProductTypes[_plan[i].pricetype];
            // IMIapp.GetProductTypes(_plan[i].pricetype);
          }
          else
            _plan[i].producttype = GetProductTypes[_plan[i].subsctiontype];
          //IMIapp.GetProductTypes(_plan[i].subsctiontype);




          _plan[i].reqprice = 0;
          _plan[i].actualprice = 0;
          _plan[i].renprice = 0;
          if (_plan[i].priceplans != null && _plan[i].priceplans.length > 0) {
            _plan[i].reqprice = _plan[i].priceplans[0].registrationprice;
            _plan[i].actualprice = _plan[i].priceplans[0].subscriptionprice;
            _plan[i].renprice = _plan[i].priceplans[0].renewalprice;
          }



        }
        catch (e) { }
      }
      this.dataSource = new MatTableDataSource(_plan);
    }
    catch (e) { }
  }

  openDialog(alert: string, text: string) {
    this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: text }
    });
  }

  ActivateService(chargeCode) {
    const dialogRef = this.dialog.open(ConfirmDialogueBoxComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Are you sure to process this request?',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {   //close : true 
        try {
          //IMIapp.blockui("Activating services");
          this._json = {};
          var url = "";
          //_json = {
          //    serviceIdentifier: this.servicedetails.servicecode, productIdentifier: chargecode, subscriptionId: this.servicedetails.serviceid
          //}

          if (this.useractiveproduct != null && this.useractiveproduct != undefined) {
            url = "service/ServiceMigration";

            this._json = {
              code: "", migrateToCode: chargeCode, serviceIdentifier: this.servicedetails.servicecode, subscriptionId: this.servicedetails.serviceid, autoRenewalFlag: "", chargeUserFlag: ""
            }
            this._json.code = this.useractiveproduct.reqChrgCode;
            this.migrationProduct = this.servicedetails.subscriptionplans.filter((element, index) => {
              return (element.chargecode == chargeCode);
            });

            if (this.migrationProduct != undefined && this.migrationProduct != null) {
              this._json.autoRenewalFlag = this.migrationProduct.enableautorenewal;
              this._json.chargeUserFlag = this.migrationProduct.chargelogic;
            }
          }
          else {
            url = "service/activateservice";
            this._json = {
              serviceIdentifier: this.servicedetails.servicecode, productIdentifier: chargeCode.chargecode, subscriptionId: this.servicedetails.serviceid
            }
          }
          if (this._json.subscriptionId != "" && this._json.serviceIdentifier != "") {
            //IMIapi.post("service/activateservice", _json).then(function (resp) {
            // IMIapi.post("service/ServiceMigration", _json).then(function (resp) {
            this.ccapiService.postData(url, this._json).subscribe((resp: any) => {
              if (resp.code == "200" && resp.status == "success") {
                // toastrmsg('success', "Request has been successfully processed");
                this.ccapiService.openDialog("success", "Request has been successfully processed");
                //IMIapp.blockui("Reloading Profile");
                setTimeout(function () {
                  this.ccapiService.post("user/getaccountinfo", {}).subscribe((resp: any) => {
                    if (resp.data.code == "200" && resp.data.status == "success") {
                      this.accountinfo = resp.data.data;
                      if (this.accountinfo != undefined && this.accountinfo != null && this.accountinfo != '') {
                        sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));
                        //this.getServiceInfo();
                        setTimeout(function () {
                          location.reload();
                        }, 200);
                      }
                      //IMIapp.unblockui();
                    }
                  });
                  setTimeout(function () {
                    //IMIapp.unblockui();
                  }, 2000);
                }, 2000);
              }
              else {
                this.ccapiService.openDialog("error", "Internal Error Unable to process your request");
                //toastrmsg('error', IMIapp.ShowJsonErrorMessage(resp));
                //IMIapp.unblockui();
              }
            });
          }
          else {
            this.ccapiService.openDialog("error", "Internal Error Unable to process your request");
            //IMIapp.unblockui();
          }
        }
        catch (e) {
          this.ccapiService.openDialog("error", "Internal Error Unable to process your request");
          //IMIapp.unblockui();
        }
      }
    });
  };

}



export class PageObject {
  public pageNo: any = 1;
  public pageSize: any = 20;
  public totalRecords: any = 0;
  public totalPages: any = 0;
}
export class OrderByObject {
  public ordercolumn: string = "";
  public direction: string = "";
}

