import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GroupWhiteListDialogComponent } from '../group-white-list-dialog/group-white-list-dialog.component';
import { ServiceWhiteListDialogComponent } from '../service-white-list-dialog/service-white-list-dialog.component';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { CcfactoryService } from '../../../../shared/services/ccfactory.service';
import { ConfirmDialogueBoxComponent } from '../../../../shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { WhitedetailsDialogComponent } from '../../../components/trans/whitedetails-dialog/whitedetails-dialog.component';
@Component({
  selector: 'app-white-list',
  templateUrl: './white-list.component.html',
  styleUrls: ['./white-list.component.css']
})
export class WhiteListComponent implements OnInit {
  public accountinfo: any;
  public grpWhiteList: object;
  public serviceWhiteList: object;
  public servicegroups: any;
  public blockprofiledet: any;

  public lstblockedservices: any[] = [];
  constructor(private dialog: MatDialog, private ccapi: CcapiService, private ccfactory: CcfactoryService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.ccfactory.getServiceGroups().then((res: any) => {
      this.servicegroups = res;
      if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
        this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
        if (this.accountinfo.subscriber.whiteLstSrvcGrp != undefined && this.accountinfo.subscriber.whiteLstSrvcGrp != null && this.accountinfo.subscriber.whiteLstSrvcGrp.length !=0) {
          this.grpWhiteList = this.accountinfo.subscriber.whiteLstSrvcGrp;
        }
        this.getServiceBySid();
      }
    });
  }
  unblockservicegroup(srvgroup) {
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
          srvgroup = this.getServiceGroupName(srvgroup);
          this.ccapi.postData("service/UnBlockWhitelistServiceGroup", { servicegroup: srvgroup }).subscribe((resp: any) => {
            this.spinner.hide();
            if (resp.code == "200") {
              this.ccapi.openDialog('success', 'Profile Updated Successfully');
              this.ccapi.postData('user/getaccountinfo', {}).subscribe((resp: any) => {
                if (resp.code == "200" && resp.status == "success" && resp.data) {
                  this.accountinfo = resp.data;
                  if (this.accountinfo != undefined && this.accountinfo != null && this.accountinfo != '') {
                    sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));
                  }
                }
              });
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

  GetActionReason(type, id): void {
    const dialogRef = this.dialog.open(WhitedetailsDialogComponent, {
      width: '450px',
      data: { type: type, id: id, title:"WHITE LIST DETAILS"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    
    });
  }
  //GetActionReason(type, id) {
  //  try {
  //    var _tmpid = "";
  //    this.blockprofiledet = { reason: "", updatedon: "" }
  //    if (type == "BLOCKLISTSRVCGRP")
  //      _tmpid = this.getServiceGroupName(id);
  //    else if (type == "WHITELISTSRVCGRP")
  //      _tmpid = this.getServiceGroupName(id);
  //    else {
  //      _tmpid = id.service_code;
  //    }
  //    this.spinner.show();
  //    this.ccapi.postData("service/GetActionReason", { type: type, service: _tmpid }).subscribe((resp: any) => {
  //      this.spinner.hide();
  //      if (resp.code == "200" && resp.status == "success") {
  //        if (resp.data.length > 0) {
  //          this.blockprofiledet = { reason: resp.data[0]["reason"], updatedon: resp.data[0]["updated_on"] }
  //           $('#whiteprofiledet').modal("show");
  //        }
  //        else {
  //          this.ccapi.openDialog('error', "Details Not found");
  //        }
  //      }
  //      else {
  //        this.ccapi.openDialog('error', resp.message);
  //      }
  //    });
  //  }
  //  catch (e) { }
  //}


  getServiceGroupName(grpid) {
    try {
      //if (grpid == "") {
      //  grpid = $scope.servicedetails.servicegroup;
      //}
      var data = $.grep(this.servicegroups, function (item: any) {
        return item.id == grpid;
      })[0];
      return data.name;
    }
    catch (e) { }
    return grpid;
  }
  groupwhite(): void {
    const dialogRef = this.dialog.open(GroupWhiteListDialogComponent, {
      width: '450px',
      data: this.servicegroups
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ccapi.postData('user/getaccountinfo', {}).subscribe((resp: any) => {
        if (resp.code == "200" && resp.status == "success" && resp.data) {
          this.accountinfo = resp.data;
          if (this.accountinfo != undefined && this.accountinfo != null && this.accountinfo != '') {
            sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));
          }
        }
      });
    });
  }
  servicewhite(): void {
    const dialogRef = this.dialog.open(ServiceWhiteListDialogComponent, {
      width: '450px',
      data: this.servicegroups
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ccapi.postData('user/getaccountinfo', {}).subscribe((resp: any) => {
        if (resp.code == "200" && resp.status == "success" && resp.data) {
          this.accountinfo = resp.data;
          if (this.accountinfo != undefined && this.accountinfo != null && this.accountinfo != '') {
            sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));
          }
        }
      });
    });
  }


  IsExistsInArray(srvgrp) {
    var isexists = true;
    isexists = this.ccfactory.isexistsinarray(srvgrp, this.accountinfo.subscriber.whiteLstSrvcGrp, 'string');
    return isexists;
  }
  getServiceBySid() {
    try {
      this.lstblockedservices = [];
      var srvs = '';
      for (var i = 0; i < this.accountinfo.subscriber.whiteLstSrvc.length; i++) {
        srvs += this.accountinfo.subscriber.whiteLstSrvc[i] + ",";
      }
      if (srvs != '') {
        this.ccapi.postData("service/GetServiceInfoByServiceId", { serviceids: srvs }).subscribe((resp: any) => {
          if (resp.code == "200" && resp.status == "success") {
            var lstblockedservices_tmp = resp.data;
            try {
              for (var i = 0; i < lstblockedservices_tmp.length; i++) {
                lstblockedservices_tmp[i].sid = lstblockedservices_tmp[i].serviceid;
                lstblockedservices_tmp[i].sname = lstblockedservices_tmp[i].servicename;
                lstblockedservices_tmp[i].service_code = lstblockedservices_tmp[i].servicecode;
              }

            } catch (e) { }
            this.lstblockedservices = lstblockedservices_tmp;
          }
          else {
            this.ccapi.openDialog('error', resp.message);
          }
        });
      }
    }
    catch (e) {
     
    }
  }
  unblockservice(srvgroup) {
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
          var _item = [{ "serviceIdentifier": srvgroup.service_code, serviceName: srvgroup.sname }];
          this.ccapi.postData("service/UnBlockWhitelistService", { service: _item, message: "" }).subscribe((resp: any) => {
            this.spinner.hide();
            if (resp.code == "200") {
              this.ccapi.openDialog('success', 'Profile Updated Successfully');
              this.ccapi.postData('user/getaccountinfo', {}).subscribe((resp: any) => {
                if (resp.code == "200" && resp.status == "success" && resp.data) {
                  this.accountinfo = resp.data;
                  if (this.accountinfo != undefined && this.accountinfo != null && this.accountinfo != '') {
                    sessionStorage.setItem("accountinfo", JSON.stringify(this.accountinfo));
                  }
                }
              });
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

}
