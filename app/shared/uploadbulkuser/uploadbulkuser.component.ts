import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-uploadbulkuser',
  templateUrl: './uploadbulkuser.component.html',
  styleUrls: ['./uploadbulkuser.component.css']
})
export class UploadbulkuserComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
 
