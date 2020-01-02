import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddDndDialogComponent } from '../add-dnd-dialog/add-dnd-dialog.component';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { ConfirmDialogueBoxComponent } from '../../../../shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-dnd-profile',
  templateUrl: './dnd-profile.component.html',
  styleUrls: ['./dnd-profile.component.css']
})
export class DndProfileComponent implements OnInit {
  public accountinfo: any;
  public dndList: object;
  constructor(private dialog: MatDialog, private ccapi: CcapiService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
      this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
      if (this.accountinfo.subscriber.chnlDND != undefined && this.accountinfo.subscriber.chnlDND != null && this.accountinfo.subscriber.chnlDND.length != 0) {
        this.dndList = this.accountinfo.subscriber.chnlDND;
      }
      //else {
      //  this.dndList = { ivr: true, sms: true }
      //  console.log(this.dndList);
      //}
    }
  }
  unblockchannel(selchannel) {
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
          this.ccapi.postData("user/SetChannelDND", { channel: selchannel, dndFlag: "0" }).subscribe((resp: any) => {
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

  adddnd(): void {
    const dialogRef = this.dialog.open(AddDndDialogComponent, {
      width: '450px',
      data: {}
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
}
