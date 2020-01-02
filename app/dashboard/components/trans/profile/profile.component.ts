import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public accountinfo: any;
  constructor() { }

  ngOnInit() {
    if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
      this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
    }
  }

}
