import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { ConfirmDialogueBoxComponent } from '../../../../shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-dnd-dialog',
  templateUrl: './add-dnd-dialog.component.html',
  styleUrls: ['./add-dnd-dialog.component.css']
})
export class AddDndDialogComponent implements OnInit {

  public dndchannel: string = "";
  constructor(private dialogRef: MatDialogRef<AddDndDialogComponent>, private ccapi: CcapiService, private dialog: MatDialog, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.dndchannel = "";
  }
  close() {
    this.dialogRef.close();
  }
  blockchannel() {
    if (this.dndchannel == "" || this.dndchannel == undefined) {
      this.ccapi.openDialog('error', "Please select Channel");
      return;
    }
    else {
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
            this.ccapi.postData("user/SetChannelDND", { channel: this.dndchannel, dndFlag: "1" }).subscribe((resp: any) => {
              this.spinner.hide();
              if (resp.code == "200") {
                this.ccapi.openDialog('success', 'Profile Updated Successfully');
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

  }
}
