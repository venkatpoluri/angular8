import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import * as sha512 from 'js-sha512';
import { MsgdialogueboxComponent } from '../msgdialoguebox/msgdialoguebox.component';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})

export class CcapiService {
  private statename: string;
  public lang: any;
  public subkey: any = "";
  public baseapiurl = "/ccareportal/";
  public httpCounter: number = 0;
  constructor(private http: HttpClient, private router: Router,
    private location: Location, private dialog: MatDialog, private translate: TranslateService) {
    if (sessionStorage.getItem("lang") != null && sessionStorage.getItem("lang") != undefined)
      this.lang = sessionStorage.getItem("lang");

    sessionStorage.setItem("lang", this.lang);
    translate.setDefaultLang(this.lang);
    console.log(sessionStorage.getItem("lang"));
    translate.use(this.lang);
  }

  public getUrl(curl): string {
    if (window.location.href.indexOf('localhost:4200') > -1) {
      return "http://localhost:44322/ccapi/" + curl;
      // return "https://d5.imidigital.net/ccapi/" + curl;
    }
    else {
      return "/ccapi/" + curl;
    }
  }
  
  private setHeaders() {
    var headersList = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'accesskey': this.getAccessKey(),
      'csrftoken': this.getCsrfKey(),
      'statename': this.getStateName(),
      'subscriberkey': this.getSubKey()
    };
    return headersList;
  }
  postData(curl, data) {
    var t = this.currenttime();
    let headersList: any = this.setHeaders();
    headersList['current'] = t;
    headersList['reqtoken'] = sha512.sha512(JSON.stringify(data) + this.getReqToken(t));
    return this.http.post(this.getUrl(curl), data, { headers: headersList });
  }
  getSHA512(s: any): string {
    try {
      return sha512.sha512(s);
    } catch (e) { return ""; }
  }

  langtranslate(key: string): any {

    return this.translate.get(key);

  }
  getSubKey() {
    if (sessionStorage.getItem('subkey') != undefined && sessionStorage.getItem('subkey') != null) {
      this.subkey = sessionStorage.getItem('subkey');
    }
    return this.subkey;
  }
  setsubkey(subkey) {
    sessionStorage.setItem('subkey', subkey);
    this.subkey = subkey;
  }
  getReqToken(t) {
    try {
      var v = '';
      for (let i = 0; i < t.length;) { v += t[i]; i = i + 2; }
      return this.getStateName() + t + v;
    } catch (e) { return this.getStateName() + t; }
  }
  getAccessKey(): string {
    try {
      return JSON.parse(this.getSession("oauth")).accesskey;
    } catch (e) { return "NA"; }
  }
  getCsrfKey(): string {
    try {
      return JSON.parse(this.getSession("oauth")).csrftoken;
    } catch (e) { return "NA"; }
  }
  getStateName(): string {
    this.statename = "";
    if (this.location.path() != "")
      this.statename = this.location.path().indexOf('/') > 0 ? this.location.path().split('/')[0] : this.location.path().split('/')[1];
    if (this.statename.trim().length == 0) this.statename = (this.getAccessKey() != "NA") ? 'dashboard' : 'login';
    return this.statename;
  }

  GetCurrencyCode () {
  try {
    var _currency = JSON.parse(window.sessionStorage.getItem("oauth")).countrycurrency;
    var _curr = (!_currency && _currency == null) ? '' : _currency;
    return _curr;
  } catch (e) { return ""; }
}

  getUserName(): string {
    try {
      return JSON.parse(this.getSession("oauth")).name;
    } catch (e) { return "NA"; }
  }
  getRole() {
    try {
      return JSON.parse(this.getSession("oauth")).role;
    } catch (e) { return "NA"; }
  }
  getUserId() {
    try {
      return JSON.parse(this.getSession("oauth")).userid;
    } catch (e) { return ""; }
  }
  setSession(n, d) {
    if (d === undefined) {
      window.sessionStorage.removeItem(n);
    } else {
      window.sessionStorage.setItem(n, btoa(d));
    }
  }
  getSession(n) {
    if (window.sessionStorage.getItem(n)) {
      return atob(window.sessionStorage.getItem(n));
    }
    return "NA";
  }
  clearSession() {
    window.sessionStorage.clear();
  }
  currenttime() {
    try {
      this.httpCounter++;
      var _dd = new Date();
      return _dd.getTime() + "" + this.httpCounter;
    }
    catch (e) { }
    return this.httpCounter;
  }
  openDialog(alert: string, txt: string, html?: boolean) {
    this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: txt, html: html }
    });
  }

  ShowJsonErrorMessage(resp) {
    try {
      if (resp != null && resp.data.data.errorInfo) {
        return resp.data.data.errorInfo.errorDescription;
      }
      else {
        if (resp.data.message != null && resp.data.message.length > 10)
          return resp.data.message;
      }
    }
    catch (e) { }
    return "--Unable to process your request. Please try again later.--";
  }
  ApiUrl(url) {
    try {
      if (url.indexOf("/uploadfiles") > 0 || url.indexOf("/UploadBulkUser") > 0) {
        if (url.indexOf("?") > 0) {
          if (url.indexOf("&") > 0) {
            url = url + "&ticks=" + this.currenttime();
          }
          else {
            url = url + "ticks=" + this.currenttime();
          }
        }
        else {
          url = url + "?ticks=" + this.currenttime();
        }
      }
    } catch (e) { }
    return this.baseapiurl + "" + url;
  }

}


