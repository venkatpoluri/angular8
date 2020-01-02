import { Component, OnInit } from '@angular/core';
import { LangFilterPipe } from 'src/app/shared/pipes/languagefilter';
import { formatDate } from '@angular/common';
import { CcapiService } from 'src/app/shared/services/ccapi.service';
declare var moment: any;
@Component({
  selector: 'app-ccindex',
  templateUrl: './ccindex.component.html',
  styleUrls: ['./ccindex.component.css']
})
export class CcindexComponent implements OnInit {
  public accountdetails: any;
  public maxDate = new Date();
  public minDate = new Date();
  public countrycode: Number;
  public mobilenumberlength: Number;
  public refundtranscount: any;
  public pendingtrans: string;
  public processedtrans: string;
  public totalrefundtrans: Number;

  constructor(private objcapi: CcapiService) {
    this.accountdetails = {
      mobilenumber: "", accountnumber: "", searchby: "0", Sessionkey: "", startdate: "", enddate: ""
    }
    this.minDate.setFullYear(this.minDate.getFullYear() - 1);
    this.accountdetails.startdate = formatDate(moment().startOf('month'), 'yyyy-MM-dd 00:00:00', 'en-US', '');
    this.accountdetails.enddate = formatDate(moment(), 'yyyy-MM-dd 23:59:59', 'en-US', '');
    if (this.countrycode == 0)
      this.countrycode = 66;
    if (this.mobilenumberlength == 0)
      this.mobilenumberlength = 11;
    this.GetTransCount();
  }
  fieldtypechange() {
    this.accountdetails.mobilenumber = "";
    this.accountdetails.accountnumber = "";
  }
  ngOnInit() {

    this.accountdetails.startdate = formatDate(moment().startOf('month'), 'yyyy-MM-dd 00:00:00', 'en-US', '');
    this.accountdetails.enddate = formatDate(moment(), 'yyyy-MM-dd 23:59:59', 'en-US', '');
    this.GetTransCount();

  }
  getccdata() {
    let isValid = this.validatemobilenumber();
    if (isValid == 1) {

    }
  }
  GetTransCount() {
    this.objcapi.postData("customercare/GetRefundRequestsCounts", {}).subscribe((resp: any) => {
      if (resp.code == "200" && resp.status == "success") {
        this.refundtranscount = resp.data;
        for (var tr = 0; tr < this.refundtranscount.length; tr++) {
          if (this.refundtranscount[tr].sistatus == "1") {
            this.pendingtrans = this.refundtranscount[tr].COUNT;
          }
          else if (this.refundtranscount[tr].sistatus == "2") {
            this.processedtrans = this.refundtranscount[tr].COUNT;
          }
          else { }
        }
        this.totalrefundtrans = parseInt(this.pendingtrans) + parseInt(this.processedtrans);
      }
    });
  }
  validatemobilenumber() {
    if (this.accountdetails.searchby == "0") {
      if (this.accountdetails.mobilenumber == "") {
        this.objcapi.openDialog("warning", 'Please enter Mobile Number'); return 0;
      }
      if (!Number.isInteger(this.accountdetails.mobilenumber)) {
        this.objcapi.openDialog("warning", 'Please enter Valid Mobile Number'); return 0;
      }
      if (this.accountdetails.mobilenumber.length < 8) {
        this.objcapi.openDialog("warning", 'Please enter Valid Mobile Number'); return 0;
      }

      if (this.accountdetails.mobilenumber.length == this.mobilenumberlength) {
        if (this.accountdetails.mobilenumber.indexOf(this.countrycode) != 0) {
          this.objcapi.openDialog("warning", 'Please enter Valid Mobile Number'); return 0;
        }
        else {
          return 1;
        }
      }
      if (this.accountdetails.mobilenumber.length ==
        (Number(this.mobilenumberlength) - Number((this.countrycode + "").length))
        && this.accountdetails.mobilenumber.indexOf('0') != 0) {
        this.accountdetails.mobilenumber = this.countrycode + this.accountdetails.mobilenumber;
        return 1;
      }
      if (this.accountdetails.mobilenumber.length ==
        (Number(this.mobilenumberlength) - Number((this.countrycode + "").length) + 1)
        && this.accountdetails.mobilenumber.indexOf('0') == 0) {
        this.accountdetails.mobilenumber = this.countrycode + this.accountdetails.mobilenumber.substring(1);
        return 1;
      }
    }
  }

}
