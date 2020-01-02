import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CcapiService } from "../shared/services/ccapi.service";
import { TranslateService } from '@ngx-translate/core';
declare var require: any;
var $ = require('jquery');
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
public lang:any;
  constructor(private translate: TranslateService,private objcapi: CcapiService, private router: Router) {
 

 if (sessionStorage.getItem("lang") != null && sessionStorage.getItem("lang") != undefined)
            this.lang = sessionStorage.getItem("lang");

        sessionStorage.setItem("lang", this.lang);
    //translate.setDefaultLang(this.lang);
    console.log(sessionStorage.getItem("lang"));
        translate.use(this.lang);
  }


  ngOnInit() {

    $('#menu-action').click(function () {
      $('.sidebar').toggleClass('active');
      $('.main').toggleClass('active');
      $(this).toggleClass('active');

      if ($('.sidebar').hasClass('active')) {
        $(this).find('i').addClass('fa-close');
        $(this).find('i').removeClass('fa-bars');
      } else {
        $(this).find('i').addClass('fa-bars');
        $(this).find('i').removeClass('fa-close');
      }
    });

  }
  public logout() {
    this.objcapi.postData("user/Logout", {}).subscribe((response: any) => {
      if (response.code != null && response.code == "200") {
        this.router.navigate(["/login"]);
        window.sessionStorage.clear();
      }
      if (response.code == "401") {
        alert('hello');
      }
      else {
        this.router.navigate(["/login"]);
        window.sessionStorage.clear();
      }
    }), (error => { console.log(error) });

  }
}
