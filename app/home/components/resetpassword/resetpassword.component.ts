import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CcapiService } from "../../../shared/services/ccapi.service";
import { MatDialog } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../shared/msgdialoguebox/msgdialoguebox.component';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  private guid: string;
  resetForm: object;
  public pwdPolicy: string;
  isActive: boolean = true;
  constructor(private router: Router, private activeRoute: ActivatedRoute, private ccapi: CcapiService, private dialog: MatDialog) {
    this.resetForm = {
      password: "",
      confirmpassword: ""
    }
    this.guid = this.activeRoute.snapshot.params['guid'];
  }

  ngOnInit() {
    this.PasswordPolicy();
  }
  PasswordPolicy() {
    this.ccapi.postData('login/GetPasswordPolicy', {}).subscribe((response: any) => {
      this.pwdPolicy = "";
      var policy = response.data;
      if (policy.MaxCharsInName != undefined && policy.MaxCharsInName > 0) {
        this.pwdPolicy += "<p>Characters in LoginID should not be present in Password.</p>";
      }
      this.pwdPolicy += "<p>Password should contain atleast " + policy.MinLength + " characters.</p>";
      this.pwdPolicy += "<p>It has not been used in the past " + policy.RestrictNoOfPrevMatches + " Passwords.</p>";
      this.pwdPolicy += "<dl><dt> It Contains the following character groups - </dt>";
      if (policy.IsUpperCaseRequired == "True") {
        this.pwdPolicy += "<dd>English Uppercase Characters [A-Z], </dd>";
      }
      if (policy.IsLowerCaseRequired == "True") {
        this.pwdPolicy += "<dd>English Lower case Characters [a-z],</dd>";
      }
      if (policy.IsNumericsRequired == "True") {
        this.pwdPolicy += "<dd>Numerals[0-9],</dd>";
      }
      if (policy.IsSpecialCharsRequired == "True") {
        var strSplChars = policy.SpecialCharactersAllowed;
        this.pwdPolicy += "<dd> Non - alphabetic characters [" + strSplChars + "],</dd>";
      }
      this.pwdPolicy += "</dl>";
    });
  }
  resetpwd(data) {
    if (this.guid.trim() == "") {
      this.ccapi.openDialog('error','Invalid Request');
      return;
    }
    if (data.password == "") {
      this.ccapi.openDialog('error','Please enter New Password');
      return;
    }
    if (data.confirmpassword == "") {
      this.ccapi.openDialog('error','Please enter Confirm Password');
      return;
    }
    if (data.password != data.confirmpassword) {
      this.ccapi.openDialog('error','New Password and Confirm Password are not same');
      return;
    }
    //this.spinner.show();
    this.ccapi.postData('login/resetpassword', { guid: this.guid, password: data.password, confirmpassword: data.confirmpassword }).subscribe((response: any) => {
      //this.spinner.hide();
      if (response.code == "200") {
        this.successDialog('success', response.message);
      }
      else {
        this.ccapi.openDialog('error',response.message);
      }
    }),
      (error => {
        //this.spinner.hide();
      this.ccapi.openDialog('error',"Sorry, We could not process your request at the moment.");
      });
  }

  showpwdPolicy() {
    this.ccapi.openDialog('warning', this.pwdPolicy,true);
  }
  helptoggle() {
    this.isActive = !this.isActive;
  }
  successDialog(alert: string, text: string) {
    const dialogRef = this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: text }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(["/#"]);
    });
  }
}
