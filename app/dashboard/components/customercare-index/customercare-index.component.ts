import { Component, OnInit } from '@angular/core';
import { CcapiService } from '../../../shared/services/ccapi.service';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../shared/msgdialoguebox/msgdialoguebox.component';
import { SHOW_MENU } from '../../../shared/models/enums.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import { CcfactoryService } from 'src/app/shared/services/ccfactory.service';
@Component({
  selector: 'app-customercare-index',
  templateUrl: './customercare-index.component.html',
  styleUrls: ['./customercare-index.component.css']
})
export class CustomercareIndexComponent implements OnInit {
  //title:string="Customer care";
  public ccareindex: any;
  getdetails: any;
  accountinfo: any;
  menuData: any[];
  masters: any;
  public refundtranscount: any;
  public pendingtrans: number = 0;
  public processedtrans: number = 0;
  public totalrefundtrans: number = 0;
  constructor(private spinner: NgxSpinnerService, private ccfactory: CcfactoryService, private ccapiService: CcapiService, private router: Router, private dialog: MatDialog) {
    this.ccareindex = {
      searchby: "0",
      mobilenumber: "",
      accountnumber: ""
    }

  }


  isVMSEnabled() {
    if (this.accountinfo && this.accountinfo.subscriber && this.accountinfo.subscriber.VMS == 1) {
      return true;
    }
    return false;
  }

  isMCNEnabled() {
    if (this.accountinfo && this.accountinfo.subscriber && this.accountinfo.subscriber.MCN == 1) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    this.spinner.hide();
    this.getmasterdata();
    //this.title=this.ccapiService.langtranslate(this.title).subscribe(res => {
    //  console.log(res);
    //   this.title = res;
    //   console.log(this.title);
    //});
    this.getusermenudata();
    this.GetTransCount();

  }
  GetTransCount() {
    this.ccapiService.postData("subscriberdata/GetRefundRequestsCounts", {}).subscribe((resp: any) => {
      if (resp.code == "200" && resp.status == "success") {
        this.refundtranscount = resp.data;
        for (var tr = 0; tr < this.refundtranscount.length; tr++) {
          if (this.refundtranscount[tr].sistatus == "1" && this.refundtranscount[tr].COUNT != null && this.refundtranscount[tr].COUNT != undefined) {
            this.pendingtrans = parseInt(this.refundtranscount[tr].COUNT);
          }
          else if (this.refundtranscount[tr].sistatus == "2") {
            this.processedtrans = parseInt(this.refundtranscount[tr].COUNT);
          }
          else { }
        }
        //alert(this.processedtrans);
        //alert(this.pendingtrans);
        this.totalrefundtrans = this.pendingtrans + this.processedtrans;
      }
    });
  }

  getmasterdata() {

    let promise = new Promise((resolve, reject) => {

      if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
        this.masters = JSON.parse(sessionStorage.getItem("srvmasters"));

        try {
          localStorage.setItem("ccsrvmasters", sessionStorage.getItem("srvmasters"));
        } catch (e) { }

        resolve();
      }
      else {

        this.ccapiService.postData('master/masters', {}).toPromise()
          .then(
            (res: any) => { // Success

              if (res.code == "200" && res.status == "success") {
                this.masters = res.data;
                sessionStorage.setItem("srvmasters", JSON.stringify(this.masters));
                try {
                  localStorage.setItem("ccsrvmasters", JSON.stringify(this.masters));
                } catch (e) { }
              }
              resolve(res);
            },
            msg => { // Error
              reject(msg);
            }
          );
      }
    });

    return promise;
  }

  getfieldDetails(ccareindex) {

    this.ccapiService.postData('user/GetDetails', ccareindex).subscribe((res: any) => {
      this.getdetails = res;
      if (res.code == "200") {
        this.ccapiService.setsubkey(res.userRefID);

        this.ccapiService.postData('user/getaccountinfo', ccareindex).subscribe((resp: any) => {
          if (resp.code == "200" && resp.status == "success" && resp.data) {
            this.accountinfo = resp.data;
            sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));


            this.router.navigate(["/dashboard/subscriptions"]);
            //if (this.accountinfo.subscriber.state == "4"
            //  || this.accountinfo.subscriber.state == "2"
            //) {
            // this.router.navigate(["/dashboard/subscriptions"]);
            //$state.go("ccaremgmt.accountinfo");
            //}
            //else
            //  $state.go("rbthome");   //TODO
          }
        });
        // this.successDialog('success', res.message);
      }
      else {
        this.openDialog(res.message);
      }
    });
  }

  getfieldDetails1(ccareindex) {

    this.ccfactory.GetMSISDNDetails(ccareindex).then((res: any) => {
      this.getdetails = res.data.accountdetails;
      this.accountinfo = res.data.accountinfo;
      if (res.code == "200" && res.status == "success") {
        this.ccapiService.setsubkey(res.userRefID);
        this.router.navigate(["/dashboard/subscriptions"]);
        //this.ccfactory.GetAccountInfo().then((resp: any) => {
        //  if (resp.code == "200" && resp.status == "success" && resp.data) {
        //    this.accountinfo = resp.data;
        //    sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));


        //    this.router.navigate(["/dashboard/subscriptions"]);
        //    //if (this.accountinfo.subscriber.state == "4"
        //    //  || this.accountinfo.subscriber.state == "2"
        //    //) {
        //    // this.router.navigate(["/dashboard/subscriptions"]);
        //    //$state.go("ccaremgmt.accountinfo");
        //    //}
        //    //else
        //    //  $state.go("rbthome");   //TODO
        //  }
        //});
        // this.successDialog('success', res.message);
      }
      else {
        this.openDialog(res.data);
      }
    });
  }


  public getusermenudata() {
    this.menuData = [];
    this.ccapiService.postData('user/MenuPermissionLoginUserId', {}).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.menuData = resp.data.data;

        if (this.menuData != undefined && this.menuData != null && this.menuData.length > 0) {
          for (var i = 0; i < this.menuData.length; i++) {
            //$.map(this.menuData, function (item) {
            var item = this.menuData[i];
            if (item.menukey == "CUSTOMERCARE_WEBAOCTRANS") {
              if (item.view == "1") {
                SHOW_MENU.webaoctransactions = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_CAMPAIGNTRANSACTIONS") {
              if (item.view == "1") {
                SHOW_MENU.campaigntransactions = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_USSDTRANSACTIONS") {
              if (item.view == "1") {
                SHOW_MENU.ussdtransactions = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_REFUNDTRANSACTIONS") {
              if (item.view == "1") {
                SHOW_MENU.refunds = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_SMSTRANSACTIONS") {
              if (item.view == "1") {
                SHOW_MENU.smstransactions = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_MESSAGINGTRANSACTION") {
              if (item.view == "1") {
                SHOW_MENU.messagingtransactions = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_CHARGINGTRANSACTIONS") {
              if (item.view == "1") {
                SHOW_MENU.chargingtransactions = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_NEWSUBSCRIPTIONS") {
              if (item.view == "1") {
                SHOW_MENU.activations = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_SUBSCRIPTIONS") {
              if (item.view == "1") {
                SHOW_MENU.subscriptions = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_VMSTRANSACTION") {
              if (item.view == "1" && this.isVMSEnabled()) {
                SHOW_MENU.vmstransactions = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_MCNTRANSACTION") {
              if (item.view == "1" && this.isMCNEnabled()) {
                SHOW_MENU.mcntransactions = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_BLOCKLIST") {
              if (item.view == "1") {
                SHOW_MENU.blocklist = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_WHITELIST") {
              if (item.view == "1") {
                SHOW_MENU.whitelist = 1;
              }
            }
            else if (item.menukey == "CUSTOMERCARE_DND") {
              if (item.view == "1") {
                SHOW_MENU.dnd = 1;
              }
            }

            //});
          }
          sessionStorage.setItem("ccaresubmenupermission", JSON.stringify(SHOW_MENU));
        }
      }
    });
  };

  openDialog(txt: string) {
    this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: 'error', msg: txt }
    });
  }

  DownloadCCareGuide() {
    this.ccapiService.postData("subscriberdata/DownloadCCareGuide", {}).subscribe((resp: any) => {
      if (resp.code == "200") {
        window.open(resp.data, '_blank', '')
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
  successDialog(alert: string, text: string) {
    const dialogRef = this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: text }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(["/dashboard/subscriptions"]);
    });
  }
}

