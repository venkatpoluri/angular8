import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-uploadbulkuser',
  templateUrl: './uploadbulkuser.component.html',
  styleUrls: ['./uploadbulkuser.component.css']
})
export class UploadbulkuserComponent {

  
  usertypes: any[] = [
    { value: '1010012', label: 'Customer Care Agent' }
  ];

  selectedusertype = '1010012';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
   
  }

  ngOnInit() {

  }


 

}
 
