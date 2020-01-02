import { Component, OnInit } from '@angular/core';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { SubscriberClasses, SubscriberTypes, NetworkTypes } from '../../../../shared/models/enums.model';
import { CcfactoryService } from "../../../../shared/services/ccfactory.service";
import { ConfirmDialogueBoxComponent } from '../../../../shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  public accountinfo: any;
  public language: string;
  public smsLang: string;
  public ivrLang: string;
  public ccLang: string;
  public userType: string;
  public userClass: string;
  public opid: string;
  public segmentlist: any;
  public showMenu: any;
  public tmpparentphone: string = "0";
  public enableeditlanguage: boolean = false;
  public enableeditsms: boolean = false;
  public enableeditivr: boolean = false;
  public enableeditcc: boolean = false;
  public enableeditmobile: boolean = false;
  public enableeditvip: boolean = false;
  public enableeditrisk: boolean = false;

  public tmpvipflag: boolean = false;
  public tmpriskflag: boolean = false;

  public disablemobile: boolean = true;
  public disablevip: boolean = true;
  public disablerisk: boolean = true;
  constructor(private ccapi: CcapiService, private ccfactory: CcfactoryService, private spinner: NgxSpinnerService, private dialog: MatDialog) {
    this.enableeditlanguage = false;
    this.enableeditsms = false;
    this.enableeditivr = false;
    this.enableeditcc = false;
    this.enableeditmobile = false;
  }

  ngOnInit() {
    this.ccfactory.getaccountinfoSession().then((res: any) => {
      if (res != null && res != '') {
        this.accountinfo = res;
        this.accountinfo.subscriber.gender == 'M' ? 'Male' : 'Female';
        this.language = this.ccfactory.getLanguage(this.accountinfo.subscriber.language);
        this.smsLang = this.ccfactory.getLanguage(this.accountinfo.chnlLang.smsLang);
        this.ivrLang = this.ccfactory.getLanguage(this.accountinfo.chnlLang.ivrLang);
        this.ccLang = this.ccfactory.getLanguage(this.accountinfo.chnlLang.ccLang);
        this.userType = SubscriberTypes[this.accountinfo.subscriber.userType];
        this.userClass = SubscriberClasses[this.accountinfo.subscriber.userClass];
        this.opid = NetworkTypes[this.accountinfo.subscriber.opid];
      }
      if (sessionStorage.getItem("ccaresubmenupermission") != null && sessionStorage.getItem("ccaresubmenupermission") != '') {
        this.showMenu = JSON.parse(sessionStorage.getItem("ccaresubmenupermission"));
      }
    });
  }
  //enablephn() {
  //  this.enableeditmobile = true;
  //  this.disablemobile = false;
  //}
  //showdisabled() {
  //  this.enableeditmobile = false;
  //  this.disablemobile = true;
  //}
  changelang = function (item, type) {
    if (type == "sms") {
      this.tmpsmslanguage = item;
    }
    if (type == "ivr") {
      this.tmpivrlanguage = item;
    }
    if (type == "cc") {
      this.tmpcclanguage = item;
    }
    if (type == "mobile") {
      this.tmpparentphone = item;
    }
    if (type == "vip") {
      this.tmpvipflag = item;
    }
    if (type == "risk") {
      this.tmpriskflag = item;
    }
  }
  editlanguage = function (type) {
    if (type == "sms")
      this.enableeditsms = true;
    if (type == "ivr")
      this.enableeditivr = true;
    if (type == "cc")
      this.enableeditcc = true;
    if (type == "mobile") {
      this.enableeditmobile = true;
      this.disablemobile = false;
    }
    if (type == "vip") {
      this.enableeditvip = true;
      this.disablevip = false;
    }
    if (type == "risk") {
      this.enableeditrisk = true;
      this.disablerisk = false;
    }
    try {
      this.tmpparentphone = this.accountinfo.subscriber.parentPhn != null ? this.accountinfo.subscriber.parentPhn + "" : "0";
      this.tmpvipflag = this.accountinfo.subscriber.vip != null ? this.accountinfo.subscriber.vip : false;
      this.tmpriskflag = this.accountinfo.subscriber.risk != null ? this.accountinfo.subscriber.risk  : false;
    }
    catch (e) { }

  }
  cancellanguage = function (type) {
    this.enableeditlanguage = false;
    if (type == "sms")
      this.enableeditsms = false;
    if (type == "ivr")
      this.enableeditivr = false;
    if (type == "cc")
      this.enableeditcc = false;
    if (type == "mobile") {
      this.enableeditmobile = false;
      this.disablemobile = true;
    }
    if (type == "vip") {
      this.enableeditvip = false;
      this.disablevip = true;
    }
    if (type == "risk") {
      this.enableeditrisk = false;
      this.disablerisk = true;
    }
    //this.ccfactory.GetAccountInfo().then((res: any) => {
    //  this.getsegmentdetails();
    //});
  }
  updatechannellanguage = function (type, data) {
    var json = {}
    if (type == "sms") {
      json = { smsLang: this.tmpsmslanguage }
    }
    if (type == "ivr") {
      json = { ivrLang: this.tmpivrlanguage }
    } if (type == "cc") {
      json = { ccLang: this.tmpcclanguage }
    }
    if (type == "mobile") {
      json = { parentPhn: data }
    }
    if (type == "vip") {
      json = { vip: this.tmpvipflag }
    }
    if (type == "risk") {
      json = { risk: this.tmpriskflag }
    }
    try {
      if (this.tmpvipflag == true && this.tmpriskflag == "true") {
        this.ccapi.openDialog('error', "You cannot enable both Risk and VIP Flags for a single Mobile Number");
        return;
      }
    } catch (e) { }

    try {
      const dialogRef = this.dialog.open(ConfirmDialogueBoxComponent, {
        disableClose: true,
        width: '400px',
        data: {
          message: 'Please click Confirm to proceed?',
          confirmText: 'Yes',
          cancelText: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          try {
            this.spinner.show();
            var url = "user/SetChannelLanguage";
            if (type == "mobile") {
              url = "user/SetParentMobile";
            }
            else if (type == "vip" || type == "risk") {
              url = "user/SetFlag";
            }
            this.enableeditlanguage = false;
            this.enableeditsms = false;
            this.enableeditivr = false;
            this.enableeditcc = false;
            this.enableeditmobile = false;
            this.enableeditvip = false;
            this.enableeditrisk = false;

            this.disablemobile = true;
            this.disablevip = true;
            this.disablerisk = true;

            this.ccapi.postData(url, json).subscribe((resp: any) => {
              this.spinner.hide();
              if (resp.code == "200" && resp.status == "success") {
                this.ccapi.openDialog('success', "Profile Updated Successfully");
                this.ccfactory.getaccountinfoSession().then((respacc: any) => {
                  if (respacc.data.code == "200" && respacc.data.status == "success") {
                    this.accountinfo = respacc.data;
                    if (this.accountinfo != undefined && this.accountinfo != null && this.accountinfo != '') {
                      sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));
                    }
                  }
                });
                setTimeout(function () {
                }, 2000);
              }
              else {
                this.ccapi.openDialog('error', resp.message);
              }
            });

          } catch (e) {
           
            this.ccapi.openDialog('error', 'Internal Error Unable to process your request');
          }
        }
      });
    }
    catch (e) {
      this.ccapi.openDialog('error', "Internal Error Unable to process your request");
    }
  }
  getsegmentdetails() {
    try {

      if (this.ccapi.getSession("seglist_" + this.accountinfo._id) != null) {
        this.segmentlist = JSON.parse(this.ccapi.getSession("seglist_" + this.accountinfo._id));
        this.bindsegmentlist();
      }
    } catch (e) { }
    if (this.segmentlist.length > 0) {
      return;
    }
    var _seg = "";
    try {
      var _segmentlst = this.accountinfo.subscriber.segmentList;
      if (_segmentlst.length > 0) {
        for (var i = 0; i < _segmentlst.length; i++) {
          _seg += _segmentlst[i] + ",";
        }
      }
    } catch (e) { }
    if (_seg != "") {
      var postdata = { segids: _seg }
      this.ccapi.postData("User/GetSegmentDetails", postdata).subscribe((resp: any) => {
        if (resp.data.code == "200" && resp.data.status == "success") {
          this.segmentlist = resp.data.data;
          this.ccapi.setSession("seglist_" + this.accountinfo._id, JSON.stringify(this.segmentlist))
          this.bindsegmentlist();
        }
        else {
          this.ccapi.openDialog("error", resp.data.message);
        }
      });
    }

  }
  bindsegmentlist() {

  }
}
