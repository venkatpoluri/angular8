import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CcapiService } from "../../../shared/services/ccapi.service";
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../shared/msgdialoguebox/msgdialoguebox.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userobj: UserObject = new UserObject();
  NgxSpinnerService: any;
  constructor(private objcapi: CcapiService, private router: Router, private dialog: MatDialog, private spinner: NgxSpinnerService ) {
 
 }
  ngOnInit() {
    this.userobj.loginid = "";
    this.userobj.encryptkey = "";
    this.userobj.password = "";
  }
 
  public Login() {
    if (this.userobj.loginid == "") {
        this.objcapi.openDialog("warning", 'Please enter loginid');
        return;
    }
    if (this.userobj.password == "") {
        this.objcapi.openDialog("warning", 'Please enter password');
        return;
    }
    this.userobj.encryptkey = btoa(this.userobj.password);
    this.spinner.show();
    this.objcapi.postData("login/Login", this.userobj).subscribe((response: any) => {
    
      if (response.code != null && response.code == "200") {
       
        sessionStorage.setItem("lang","en");
        this.objcapi.setSession("oauth", JSON.stringify(response.data));
        
        this.router.navigate(["/dashboard/ccindex"]);
       
      }
      else {
        this.spinner.hide();
        this.openDialog('error', response.message);
      }
    }), (error => { this.spinner.hide(); console.log(error); });

    }

    //----> Below Dialog Was Moved to Service
  openDialog(alert: string, txt: string) {
    this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: txt }
    });
  }
}

export class UserObject {
  public loginid: string;
  public encryptkey: string;
  public password: string;
}
