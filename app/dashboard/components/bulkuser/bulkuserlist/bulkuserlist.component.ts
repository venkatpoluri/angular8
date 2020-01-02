import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Route } from "@angular/router";
import { CcapiService } from "../../../../shared/services/ccapi.service";
import { Subject } from "rxjs";
import { MatDialog, MatSpinner } from '@angular/material';
import { UploadbulkuserComponent } from '../../bulkuser/uploadbulkuser/uploadbulkuser.component';
import { StatusgraphComponent } from '../../bulkuser/statusgraph/statusgraph.component';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-bulkuserlist',
  templateUrl: './bulkuserlist.component.html',
  styleUrls: ['./bulkuserlist.component.css']
})


export class BulkuserlistComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private ccapi: CcapiService, private dialog: MatDialog) { }
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   
  bulkuserlist = [];
  ngOnInit() {
    //this.dtOptions = {
    //  pagingType: 'full_numbers',
    //  pageLength: 10,
    //};

    this.getbulklist();
    this.bulkuserlist = [];
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }


 
  private bulkuploaddialog() {
    try {
      let dialogRef = this.dialog.open(UploadbulkuserComponent, {
        //disableClose: true,
        width: '900px'
      });

      dialogRef.afterClosed().subscribe(() => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.getbulklist();
        }); 
      });
    }
    catch (e) { }
  };


 

  getbulklist() {
    try {
      
      this.ccapi.postData('user/GetBulkUserUploadData', {}).subscribe((response: any) => {
        if (response.code == "500" && response.status == "error") {
          this.ccapi.openDialog("warning", response.message);
          return;
        }
        else if (response.code == "200" && response.status == "success") {
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
