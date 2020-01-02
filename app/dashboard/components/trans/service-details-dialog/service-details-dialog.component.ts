import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { CcapiService } from '../../../../shared/services/ccapi.service';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent, MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';


@Component({
  selector: 'app-service-details-dialog',
  templateUrl: './service-details-dialog.component.html',
  styleUrls: ['./service-details-dialog.component.css']
})
export class ServiceDetailsDialogComponent implements OnInit {
  Date = new Date();
  public pageObject: PageObject = new PageObject();
   
  public permission: any;
  public servicecode: string;
  public loginRole: any;
  public servicedetails: any;
  public productInfo: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ccapiService: CcapiService, private router: Router, private dialog: MatDialog, private zone: NgZone, private dialogRef: MatDialogRef<ServiceDetailsDialogComponent>) {
    if (data && data.servicecode)
      this.servicecode = data.servicecode;

    this.servicedetails = {};
  }

  close() {
    this.dialogRef.close('');
  }



  ngOnInit() {
    this.pageObject.pageNo = "1";
    this.pageObject.pageSize = "10";
    this.pageObject.totalPages = "0";
    this.pageObject.totalRecords = "0";
    
    this.loginRole = this.ccapiService.getRole(); 
 
    this.getServiceInfo();
  }
    
   //this.servicedetails = response.data;
  myresponse: any;
  public getServiceInfo() {
    var postData = { servicecode: this.servicecode };
    this.ccapiService.postData("service/GetServiceInfoByServiceCode", postData).subscribe((response: any) => {
      if (response.code == '200' && response.status == 'success') {
        //this.servicedetails = tempsjon.data[0];
        this.servicedetails = response.data[0];
        try {
          this.permission = response.permission;
        } catch (e) { }
      }
      else {
        this.openDialog('error', "No service providers found");
      }
    });
  }
   
  openDialog(alert: string, text: string) {
    this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: text }
    });
  }
}
export class PageObject {
  public pageNo: any = 1;
  public pageSize: any = 20;
  public totalRecords: any = 0;
  public totalPages: any = 0;
}
