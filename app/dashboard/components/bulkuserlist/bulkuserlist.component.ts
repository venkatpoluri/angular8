import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Route } from "@angular/router";
import { CcapiService } from "../../../shared/services/ccapi.service";
import { Subject } from "rxjs";
import { MatDialog, MatSpinner } from '@angular/material';
import { UploadbulkuserComponent } from '../bulkuserlist/uploadbulkuser.component';
import { StatusgraphComponent } from '../bulkuserlist/statusgraph/statusgraph.component';

@Component({
  selector: 'app-bulkuserlist',
  templateUrl: './bulkuserlist.component.html',
  styleUrls: ['./bulkuserlist.component.css']
})

  
export class BulkuserlistComponent implements OnInit {

  constructor(private router: Router, private ccapi: CcapiService, private dialog: MatDialog) { }
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  bulkuserlist = [];
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };

    this.getbulklist();
    this.bulkuserlist = [];
     
   
  }

  private bulkuploaddialog() {
    try {
      this.dialog.open(UploadbulkuserComponent, {
        disableClose: true,
        width: '900px'
      });
    }
    catch (e) { }
  };


  //OpenShowgraphPopup(alert: string, text: string) {
  //  this.dialog.open(UploadbulkuserComponent, {
  //    disableClose: true,
  //    width: '400px',
  //    data: { type: alert, msg: text }
  //  });
  //}
 

 

  private getbulklist() {
    try {
      this.ccapi.postData('user/GetBulkUserUploadData', {}).subscribe((response: any) => {
        if (response.status == "500" || response.status == "error") {
          this.ccapi.openDialog("warning", response.message);
          return;
        }
        else if (response.status == "200" || response.status == "success" || response.status == "Success") {
          this.bulkuserlist = response.data;
          this.dtTrigger.next();
        }
        else {
          alert();
        }
      });
    }
    catch (e) { }
  };


  private ShowgraphPopup = function (id) {
    var item = this.bulkuserlist.filter(function (element, index) {
      return (element.iid === id);
    })[0];
     
     if (item != null) {
       this.dialog.open(StatusgraphComponent, {
         disableClose: true,
         width: '400px',
         data: { item }
       });
     }
  }


 
}
