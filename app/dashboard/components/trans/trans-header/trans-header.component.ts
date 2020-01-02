import { Component, OnInit } from '@angular/core';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { Router } from "@angular/router";
import { CcfactoryService } from 'src/app/shared/services/ccfactory.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogueBoxComponent } from 'src/app/shared/confirm-dialogue-box/confirm-dialogue-box.component';
declare var require: any;
var $ = require('jquery');
@Component({
  selector: 'app-trans-header',
  templateUrl: './trans-header.component.html',
  styleUrls: ['./trans-header.component.css']
})
export class TransHeaderComponent implements OnInit {
  public accountdata: any;
  subscriber1: any;
  getaccountinfo: any;
  public accountinfo: any;
  public tmp_usertype: any;
  public SubscriberTypes: any;
  public NetworkTypes: any;
  public tmp_networktype: any;
  tmp_subtier: any;
  public accountdetails: any;
  public enteredmobileno: any;
  constructor(private ccapiService: CcapiService, private ccfactory: CcfactoryService, private router: Router, private dialog: MatDialog) {
    this.subscriber1 = {
      msisdn: ""
    };
  }

  ngOnInit() {
    this.GetAcountinfo();

    //$(window).scroll(function () {
    //  if ($(window).scrollTop() >= 360) {
    //    $('.fix_trans').addClass('fixed-header');
    //    $('.fix_trans').attr('style', 'position: fixed');
    //  }
    //  else {
    //    $('.fix_trans').removeClass('fixed-header');
    //    $('.fix_trans').attr('style', 'position: absolute');
    //  }
    //});
    //this.accountdata = this.ccapiService.getaccountinfo();
    //this.subscriber1 = this.accountdata.subscriber;

    //var stickyOffset = $('.sticky').offset().top;
    //$(window).scroll(function () {
    //  var sticky = $('.sticky'),
    //    scroll = $(window).scrollTop();

    //  if (scroll >= 100) sticky.addClass('fixed');
    //  else sticky.removeClass('fixed');
    //});

  }

  getAccountDetails() {
    const dialogRef = this.dialog.open(ConfirmDialogueBoxComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Please Confirm to Change Mobile Number?',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {   //close : true 
        try {
          this.ccfactory.GetMSISDNDetails(this.enteredmobileno).then((res: any) => {
            //this.getdetails = res.data.accountdetails;
            this.accountinfo = res.data.accountinfo;
            if (res.code == "200" && res.status == "success") {
              this.ccapiService.setsubkey(res.userRefID);
              this.router.navigate(["/dashboard/subscriptions"]);
            }
            else {
              this.ccapiService.openDialog("error", res.data);
            }
          });
        }
        catch (e) {
          this.ccapiService.openDialog("error", "Internal Error Unable to process your request");
          //IMIapp.unblockui();
        }
      }
    });
  }

  GetAcountinfo() {
    if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
      this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
      this.enteredmobileno = this.accountinfo._id + "";
    
     // this.accountdetails.usernumber = this.enteredmobileno;

      this.GetPrepaidOrPostpaid();
      this.GetNetworkTypes();
      try {
        this.tmp_subtier = this.accountinfo.subscriber.userTier.sgmnt;
      }
      catch (E) { }
    }
  };
  GetPrepaidOrPostpaid() {
    try {
      if (this.accountinfo.subscriber.userType != null &&
        this.accountinfo.subscriber.userType != undefined) {
        this.tmp_usertype = this.accountinfo.subscriber.userType;
      }
    }
    catch (e) { }
    return "";
  }

  GetNetworkTypes() {
    try {
      if (this.accountinfo.subscriber.opid != null &&
        this.accountinfo.subscriber.opid != undefined) {
        this.tmp_networktype = this.accountinfo.subscriber.opid;
      }
    }
    catch (e) { }
    return "";
  }

  GetSubscriberType() {
    try {
      if (this.accountinfo.subscriber.userNtw != null &&
        this.accountinfo.subscriber.userNtw != undefined) {
        this.tmp_networktype = this.accountinfo.subscriber.userNtw;
      }
    }
    catch (e) { }
    return "";
  }
  //getaccountdetails() {
  //  this.ccapiService.postData('user/getaccountinfo', this.subscriber1.msisdn).subscribe((res: any) => {
  //    this.getaccountinfo = res.data;

  //    if (res.code == "200") {
  //      sessionStorage.setItem("accountinfo", JSON.stringify(this.getaccountinfo));
  //      this.accountdata = this.getaccountinfo;
       
  //    }
  //    else {
       
  //    }
  //  });
  //}
}
