import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { ConfirmDialogueBoxComponent } from '../../../../shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-service-white-list-dialog',
  templateUrl: './service-white-list-dialog.component.html',
  styleUrls: ['./service-white-list-dialog.component.css']
})
export class ServiceWhiteListDialogComponent implements OnInit {
  public servicegroups: any;
  public srvwhitegroup: any;
  public srvwhitereason: string = "";
  public accountinfo: any;
  public servicesbygrp: any[] = [];
  public blockservice: any;
  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<ServiceWhiteListDialogComponent>, private spinner: NgxSpinnerService,
    private ccapi: CcapiService, @Inject(MAT_DIALOG_DATA) data) {
    this.servicegroups = data;
    this.srvwhitegroup = [];
    this.srvwhitereason = "";
    this.blockservice = "";
  }

  ngOnInit() {
    if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
      this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
    }
  }
  blockservices() {
    var selectedService = [];
    try {
      var _cc = $.grep(this.accountinfo.subscriber.whiteLstSrvc, function (itm) {
        return itm == this.blockservice;
      })
      if (_cc != null && _cc != undefined && _cc.length > 0) {
        this.ccapi.openDialog('error', "Already Service is under Whitelist");
        return;
      }
    } catch (e) { }
    try {
      var bsid = parseInt(this.blockservice);
      var _bservice = $.grep(this.servicesbygrp, function (itm) {
        return itm.sid == bsid;
      })[0];

      if (_bservice == null || _bservice == undefined || _bservice.length == 0 || _bservice ==[]) {
        this.ccapi.openDialog('error', "Invalid Service.");
        return;
      }
      var _item = { "serviceIdentifier": _bservice.service_code, serviceName: _bservice.sname };
      selectedService.push(_item);
    } catch (e) {
      console.log(e);
    }
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
          this.ccapi.postData("service/WhitelistService", { service: selectedService, message: this.srvwhitereason }).subscribe((resp: any) => {
            this.spinner.hide();
            if (resp.code == "200") {
              this.ccapi.openDialog('success', 'Profile Updated Successfully');
              this.srvwhitegroup = [];
              this.blockservice = "";
              this.srvwhitereason = "";
              this.dialogRef.close();
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
  getservicesbygrp() {
    try {
      this.spinner.show();
      this.ccapi.postData("service/GetServicesByServiceGroup", { servicegroup: this.srvwhitegroup }).subscribe((resp: any) => {
        this.spinner.hide();
        if (resp.code == "200" && resp.status == "success") {
          this.servicesbygrp = resp.data;
          for (var i = 0; i < this.servicesbygrp.length; i++) {
            var _item = { "serviceIdentifier": this.servicesbygrp[i].service_code, serviceName: this.servicesbygrp[i].sname };
            if (this.servicesbygrp[i].srvarray == undefined || this.servicesbygrp[i].srvarray == null) {
              this.servicesbygrp[i].srvarray = [];
            }
            this.servicesbygrp[i].srvarray.push(_item);
          }
        }
        else {
          this.ccapi.openDialog('error',resp.message);
        }
      });
    }
    catch (e) {  }
  }

  close() {
    this.dialogRef.close();
  }
}
