import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { ConfirmDialogueBoxComponent } from '../../../../shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatOption } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-group-white-list-dialog',
  templateUrl: './group-white-list-dialog.component.html',
  styleUrls: ['./group-white-list-dialog.component.css']
})
export class GroupWhiteListDialogComponent implements OnInit {
  searchUserForm: FormGroup;
  public servicegroups: any;
  public blockgrouplist: any;
  public blockgroupreason: string = "";
  public accountinfo: any;
  @ViewChild('allSelected') private allSelected: MatOption;
  constructor(private fb: FormBuilder,private dialog: MatDialog, private dialogRef: MatDialogRef<GroupWhiteListDialogComponent>, private spinner: NgxSpinnerService,
    private ccapi: CcapiService, @Inject(MAT_DIALOG_DATA) data) {
    this.servicegroups = data;
    this.blockgrouplist = "";
    this.blockgroupreason = "";
  }
  ngOnInit() {
    this.searchUserForm = this.fb.group({
      userType: new FormControl('')
    });
    console.log(this.servicegroups);
    if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
      this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
    }
  }
  blockservicegroup() {
    var _list = "";
    if (this.blockgrouplist == null || this.blockgrouplist == undefined || this.blockgrouplist.length == 0 || this.blockgrouplist =="") {
      this.ccapi.openDialog('error', "Select Service group");
      return;
    }
    try {
      var isexists = false;
      for (var i = 0; i < this.blockgrouplist.length; i++) {
        var _sgpid = this.blockgrouplist[i];
        _list += "," + _sgpid;
        var _cc = $.grep(this.accountinfo.subscriber.whiteLstSrvcGrp, function (itm) {
          return itm == _sgpid;
        });
        if (_cc != null && _cc != undefined && _cc.length > 0) {
          var srvgrpName = this.getServiceGroupName(_sgpid);
          this.ccapi.openDialog('error', "Already Service Group - '" + srvgrpName + "' is under Whitelist");
          _list = "";
          isexists = true;
          break;
        }
      }
      if (isexists)
        return;
    }
    catch (e) { }

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
          this.ccapi.postData("service/WhitelistServiceGroup", { servicegroup: _list, message: this.blockgroupreason }).subscribe((resp: any) => {
            this.spinner.hide();
            if (resp.code == "200") {
              this.ccapi.openDialog('success', 'Profile Updated Successfully');
              this.blockgrouplist = [];
              this.blockgroupreason = "";
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
  close() {
    this.dialogRef.close();
  }
  tosslePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.searchUserForm.controls.userType.value.length == this.servicegroups.length)
      this.allSelected.select();
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.searchUserForm.controls.userType
        .patchValue([...this.servicegroups.map(item => item.id), 0]);
    } else {
      this.searchUserForm.controls.userType.patchValue([]);
    }
  }
}
