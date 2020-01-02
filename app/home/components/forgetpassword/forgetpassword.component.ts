import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CcapiService } from "../../../shared/services/ccapi.service";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {

  userdetails: any;
  constructor(private router: Router , private ccapi: CcapiService) {
    this.userdetails = {
      username : ""
    };
  }

  forgetpassword() {
    this.ccapi.postData('login/ForgotPasswordreq', { UserName: this.userdetails.username }).subscribe((response: any) => {
        if (response.status == "500" || response.status == "error") {
            this.ccapi.openDialog("warning", response.message);
            return;
        }
        else if (response.status == "200" || response.status == "success" || response.status == "Success") {
            this.ccapi.openDialog("success", response.message);
            this.router.navigate(["/"]);
        }
      //var policy = response.data.data;
    });
  }

  ngOnInit() {
   
  }

}
