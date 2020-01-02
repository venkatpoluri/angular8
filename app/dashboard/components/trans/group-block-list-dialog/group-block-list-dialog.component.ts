import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { ConfirmDialogueBoxComponent } from '../../../../shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-group-block-list-dialog',
  templateUrl: './group-block-list-dialog.component.html',
  styleUrls: ['./group-block-list-dialog.component.css']
})
export class GroupBlockListDialogComponent implements OnInit {
  public servicegroups: any;
  public blockgrouplist: any;
  public blockgroupreason: string = "";
  public accountinfo: any;
  public masters: any;
  public languages: any;
  public reasoncodelist: any[] = [];
  public reasonmessage: string = "";
  public reasoncode: string = "BCC001";
  public lang: string = "en";
  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<GroupBlockListDialogComponent>, private spinner: NgxSpinnerService,
    private ccapi: CcapiService, @Inject(MAT_DIALOG_DATA) data) {
    this.servicegroups = data;
    this.blockgrouplist = "";
    this.blockgroupreason = "";
   // this.reasoncodelist = [];
   // this.reasonmessage = "";
    this.reasoncode = "BCC001";
    this.lang = "en";
    this.getmasterdata();
  }
  ngOnInit() {
    if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
      this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
    }
  }

 getmasterdata(){
    if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
      this.masters = JSON.parse(sessionStorage.getItem("srvmasters"));
      this.languages = this.masters.lang;
      try {
        var tmplanglist = $.grep(this.masters.reasoncodes, function (item:any) {
          return item.vcreasontype == 'blocklist';
        });
        if (tmplanglist != null) {
          var _cnt = parseInt(this.languages.length + "");
          for (var i = 0; i < this.languages.length && i < _cnt; i++) {
            try {
              var tmpcode = $.grep(tmplanglist, function (item) {
                return item.vclang == this.languages[i].value;
              });
              if (tmpcode == null || tmpcode == undefined || tmpcode.length == 0) {
                this.languages.splice(i, 1);
                i--;
              }
            }
            catch (e) { }
          }
        }

      } catch (e) { }
      var lng = this.lang;
      this.reasoncodelist = $.grep(this.masters.reasoncodes, function (item:any) {
        return item.vcreasontype == 'blocklist' && item.vclang == lng;
      });
      if (this.languages != undefined && this.languages != null && this.languages.length > 0) {
        if (this.lang == undefined && this.lang == null) {
          this.lang = this.languages[0].value;
        }
      }
      if (this.reasoncode != undefined && this.reasoncode != null) {
        var rcode = this.reasoncode;
        var rclist = $.grep(this.reasoncodelist, function (item) {
          return item.vcreasoncode == rcode && item.vclang == lng;
        })[0];
        this.reasonmessage = rclist.vcreason;
      }
    }
  }
  onChangeLanguage(){
    this.reasoncode = "BCC001";
    var lng = this.lang;
    this.reasoncodelist = $.grep(this.masters.reasoncodes, function (item:any) {
      return item.vcreasontype == 'blocklist' && item.vclang == lng;
    });
    if (this.reasoncodelist != undefined && this.reasoncodelist != null && this.reasoncodelist.length > 0) {
      this.reasoncode = this.reasoncodelist[0].vcreasoncode;
    }
    this.SetReasonMessage();
  }
  SetReasonMessage() {
    this.reasonmessage = "";
    try {
      var lng = this.lang;
      var rcode = this.reasoncode;
      var rclist = $.grep(this.reasoncodelist, function (item) {
        return item.vcreasoncode == rcode && item.vclang == lng;
      })[0];
      this.reasonmessage = rclist.vcreason;
    }
    catch (e) {
      console.log(e);
    }
  }

  blockservicegroup() {
    var _list = "";
    if (this.blockgrouplist == null || this.blockgrouplist == undefined ||  this.blockgrouplist.length == 0) {
      this.ccapi.openDialog('error', "Select Service group");
      return;
    }
    try {
      try {
        var isexists = false;

        for (var i = 0; i < this.blockgrouplist.length; i++) {
          var _sgpid = this.blockgrouplist[i];
          _list += "," + _sgpid;
          var _cc = $.grep(this.accountinfo.subscriber.blockLstSrvcGrp, function (itm) {
            return this.getServiceGroupName(itm) == _sgpid;
          });
          if (_cc != null && _cc != undefined && _cc.length > 0) {
            this.ccapi.openDialog('error', "Already Service Group - '" + _sgpid + "' is under Blocklist");
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
            this.ccapi.postData("service/BlockServiceGroup", { servicegroup: _list, message: this.reasonmessage, reasoncode: this.reasoncode }).subscribe((resp: any) => {
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

    } catch (e) {

    }
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

  selectAll(select: NgModel, values, array) {
    select.update.emit(values);
  }

  deselectAll(select: NgModel) {
    select.update.emit([]);
  }
}
