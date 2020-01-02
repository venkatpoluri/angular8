import { Component, OnInit, Inject } from '@angular/core';
import { ServiceGroupByIdPipe } from 'src/app/shared/pipes/custompipes.pipe';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { CcfactoryService } from 'src/app/shared/services/ccfactory.service';
@Component({
  selector: 'app-whitedetails-dialog',
  templateUrl: './whitedetails-dialog.component.html',
  styleUrls: ['./whitedetails-dialog.component.css']
})
export class WhitedetailsDialogComponent implements OnInit {
    blockprofiledet: { reason: string; updatedon: string; };
  public title: string = "";

  constructor(private ccfactory: CcfactoryService,private ccapi: CcapiService, public dialogRef: MatDialogRef<WhitedetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data)
    this.title = this.data.title;
      try {
        var _tmpid = "";
        this.blockprofiledet = { reason: "", updatedon: "" }
        if (this.data.type == "BLOCKLISTSRVCGRP")
          _tmpid = this.getServiceGroupName(this.data.id);
        else if (this.data.type == "WHITELISTSRVCGRP")
          _tmpid = this.getServiceGroupName(this.data.id);
        else {
          _tmpid = this.data.id.service_code;
        }
        //this.spinner.show();
        this.ccapi.postData("service/GetActionReason", { type: this.data.type, service: _tmpid }).subscribe((resp: any) => {
          //this.spinner.hide();
          if (resp.code == "200" && resp.status == "success") {
            if (resp.data.length > 0) {
              this.blockprofiledet = { reason: resp.data[0]["reason"], updatedon: resp.data[0]["updated_on"] }
               //$('#whiteprofiledet').modal("show");
            }
            else {
              this.ccapi.openDialog('error', "Details Not found");
              this.dialogRef.close();
            }
          }
          else {
            this.ccapi.openDialog('error', resp.message);
            this.dialogRef.close();
          }
        });
      }
      catch (e) { }
  }

  close() {
    this.dialogRef.close();
  }

getServiceGroupName(id: string) {
  let name = new ServiceGroupByIdPipe(this.ccfactory).transform(id);
  return name;
};

}
