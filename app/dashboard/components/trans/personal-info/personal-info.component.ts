import { Component, OnInit } from '@angular/core';
import { CcfactoryService } from "../../../../shared/services/ccfactory.service";
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {

  public accountinfo: any;
  public language: string;
  constructor(private ccfactory: CcfactoryService) { }

  ngOnInit() {
    this.ccfactory.getaccountinfoSession().then((res: any) => {
      if (res != null && res != '') {
        this.accountinfo = res;
        this.accountinfo.subscriber.gender == 'M' ? 'Male' : 'Female';
        this.language = this.ccfactory.getLanguage(this.accountinfo.subscriber.language);
      }
    });
  }
}
