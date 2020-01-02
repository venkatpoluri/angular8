import { Injectable } from '@angular/core';
import { CcapiService } from '../services/ccapi.service';

@Injectable({
  providedIn: 'root'
})
export class CcfactoryService {
  constructor(private ccapi: CcapiService) { }


  GetMSISDNDetails(msisdn) {
    //var _data = { accountdetails: {}, accountinfo: {} };
    var result = {
      data: { accountdetails: {}, accountinfo: {} },
      code:"200",
      status: 'success'
    }
    let promise = new Promise((resolve, reject) => {
      this.ccapi.postData("user/GetDetails",  msisdn).toPromise()
        .then(
          (res: any) => { // Success
            if (res.code == "200" && res.status == "success") {
              this.GetAccountInfo().then((resp: any) => {
                if (resp.code == "200" && resp.status == "success" && resp.data) {
                  result.data.accountinfo = {};
                  result.data.accountinfo = resp.data;
                  result.data.accountdetails = res;
                  sessionStorage.setItem("accountinfo", JSON.stringify(result.data.accountinfo));
                  //this.router.navigate(["/dashboard/subscriptions"]);
                }
                resolve(result);
              });
            }
            else {
              result = {
                data: res.message || "",
                code: "500",
                status: 'error'
              }

              resolve(result);
            }
          },
        msg => { // Error
          result = {
            data: msg || {},
            code: "500",
            status: 'error'
          }
          reject(result);
          }
        );
    });
    return promise;
  }

  GetRoles() {
    let promise = new Promise((resolve, reject) => {
     this.ccapi.postData("master/UserRoles", {}).toPromise()
        .then(
          res => { // Success
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
      });
    return promise;
  }

  getLanguage(lan) {
    if (lan == undefined || lan == "")
      lan = "EN";
    switch (lan.toLowerCase()) {
      case "en": return "English";
      case "th": return "Thai";
      case "ar": return "Arabic";
      case "bn": return "Bengali";
      case "bg": return "Bulgarian";
    }
    return lan;
  }

  getServiceGroups() {
    let promise = new Promise((resolve, reject) => {

      if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
        var masters = JSON.parse(sessionStorage.getItem("srvmasters"));

        if (masters && masters.servicegroup) {
          resolve(masters.servicegroup);
        }
        else {
          resolve([]);
        }

      }
      else {
        resolve([]);
      }
    });

    return promise;
  };

  getChannels() {
    let promise = new Promise((resolve, reject) => {

      if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
        var masters = JSON.parse(sessionStorage.getItem("srvmasters"));

        if (masters && masters.channels) {
          resolve(masters.channels);
        }
        else {
          resolve([]);
        }

      }
      else {
        resolve([]);
      }
    });

    return promise;
  };

  getServiceStatus() {
    let promise = new Promise((resolve, reject) => {

      if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
        var masters = JSON.parse(sessionStorage.getItem("srvmasters"));

        if (masters && masters.srvstatus) {
          resolve(masters.srvstatus);
        }
        else {
          resolve([]);
        }

      }
      else {
        resolve([]);
      }
    });

    return promise;
  };


  getLanguages() {
    let promise = new Promise((resolve, reject) => {

      if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
        var masters = JSON.parse(sessionStorage.getItem("srvmasters"));

        if (masters && masters.lang) {
          resolve(masters.lang);
        }
        else {
          resolve([]);
        }

      }
      else {
        resolve([]);
      }
    });

    return promise;
  };

  getReasonCodes() {
    let promise = new Promise((resolve, reject) => {

      if (sessionStorage.getItem("srvmasters") != null && sessionStorage.getItem("srvmasters") != '') {
        var masters = JSON.parse(sessionStorage.getItem("srvmasters"));

        if (masters && masters.reasoncodes) {
          resolve(masters.reasoncodes);
        }
        else {
          resolve([]);
        }

      }
      else {
        resolve([]);
      }
    });

    return promise;
  };

  getaccountinfoSession() {
    let promise = new Promise((resolve, reject) => {
      if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
        var accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
        if (accountinfo) {
          resolve(accountinfo);
        }
        else {
          resolve([]);
        }
      }
      else {
        resolve([]);
      }
    });

    return promise;
  }
  GetAccountInfo() {
    let promise = new Promise((resolve, reject) => {
      this.ccapi.postData("user/getaccountinfo", {}).toPromise()
        .then(
          res => { // Success
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  isexistsinarray (elem, array, arraytype) {
    var exists = false;
    try {
      if (array != undefined && array != null && array.length > 0) {
        var _id = elem;
        if (arraytype == 'int') {
          _id = parseInt(elem);
        }
        if (array.indexOf(_id) > -1) {
          exists = true;
        }
        else {
          exists = false;
        }
      }
    }
    catch (e) { }
    return exists;
  };
}
