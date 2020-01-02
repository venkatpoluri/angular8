import { Component, Inject, ViewChild, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { CcapiService } from "../../../../shared/services/ccapi.service";
import { BulkuserlistComponent } from '../bulkuserlist/bulkuserlist.component';
 
@Component({
  selector: 'app-uploadbulkuser',
  templateUrl: './uploadbulkuser.component.html',
  styleUrls: ['./uploadbulkuser.component.css']
})
 
export class UploadbulkuserComponent {
  uploadeddetails: any;
  usertypes: any[] = [
    { value: '1010012', label: 'Customer Care Agent' }
  ];

   selectedusertype: string = '1010012';

  getUploadResp(data) {
    this.uploadeddetails = data;
  };
 
  constructor(public dialogRef: MatDialogRef<BulkuserlistComponent>, private ccapi: CcapiService) {
    
  }


  private addbulkuseruploaddata() {
    try {
      //this.bulklist.getbulklist();
      this.ccapi.postData('user/AddBulkUserUploadData', { guid: this.uploadeddetails, usertype: this.selectedusertype }).subscribe((response: any) => {
        if (response.code == "500" && response.status == "error") {
          this.ccapi.openDialog("warning", response.message);
          return;
        }
        else if (response.code == "200" && response.status == "success") {
          this.dialogRef.close();
        }
        else {
          alert();
        }
      });
    }
    catch (e) { }
  };
   

  ngOnInit() {
     //this.SetUploaderParams();
  }


 

}
 
