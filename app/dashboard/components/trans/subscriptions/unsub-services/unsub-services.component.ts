import { Component, OnInit, Inject } from '@angular/core';
import { CcfactoryService } from 'src/app/shared/services/ccfactory.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ServiceGroupByIdPipe } from 'src/app/shared/pipes/custompipes.pipe';
import { CcapiService } from 'src/app/shared/services/ccapi.service';
import { ConfirmDialogueBoxComponent } from 'src/app/shared/confirm-dialogue-box/confirm-dialogue-box.component';

@Component({
  selector: 'app-unsub-services',
  templateUrl: './unsub-services.component.html',
  styleUrls: ['./unsub-services.component.css']
})
export class UnsubServicesComponent implements OnInit {

  servicegroups: any[];
  subscriptionsinfo: any[];
  selecteditems: any[];
  accountinfo: any;
  reasoncodes: any[];
  languages: any[];
  selectedrows: any[];
  constructor(private ccapi: CcapiService, private dialog: MatDialog, private ccfactory: CcfactoryService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  unsubobj = {
    servicegroup: '0', unsubtype: '2', partner: '0', reasoncode: '0', reasonmsg: '', comments: '', unsubmode: "0",
    servicegrplist: [], partnerlist: [], servicedetais: [], serviceinfodetails: [], reasoncodelist:[], language: "th"
  }

  ngOnInit() {
    this.subscriptionsinfo = this.data.subscriptions;
    this.getLanguages();
    this.getReasonCodes();
    this.getServiceGroups();
   
    


    if (sessionStorage.getItem("accountinfo") != null && sessionStorage.getItem("accountinfo") != '') {
      this.accountinfo = JSON.parse(sessionStorage.getItem("accountinfo"));
    }
  }

 


  getServiceGroups() {
    try {
      this.ccfactory.getServiceGroups().then((res: any) => {
        this.servicegroups = res;
        this.formunsubscribeservices();
      });

    }
    catch (e) { }
  }


  getLanguages() {
    try {
      this.ccfactory.getLanguages().then((res: any) => {
        this.languages = res;
      });

    }
    catch (e) { }
  }

  getReasonCodes() {
    try {
      this.ccfactory.getReasonCodes().then((res: any) => {
        this.reasoncodes = res;
      });

    }
    catch (e) { }
  }


  getServiceGroupName(id: string) {
    let name = new ServiceGroupByIdPipe(this.ccfactory).transform(id);
    return name;
  };

  onChangeLanguage() {
    var scope = this;
    scope.unsubobj.reasonmsg = "";
    scope.unsubobj.reasoncode = "";
    scope.unsubobj.reasoncodelist = scope.reasoncodes.filter(function (item) {
      return item.vcreasontype == 'unsub' && item.vclang == scope.unsubobj.language
        && (item.vcsubscribertype == scope.accountinfo.subscriber.userType ||
          item.vcsubscribertype == "");
    });
  }

  SetReasonMessage() {
    var scope = this;
    scope.unsubobj.reasonmsg = "";
    try {

      var data = scope.unsubobj.reasoncodelist.filter(function (item) {
        return item.vcreasoncode == scope.unsubobj.reasoncode
          && item.vclang == scope.unsubobj.language;
      })[0];
      scope.unsubobj.reasonmsg = data.vcreason;
      return;
    }
    catch (e) { }

  }


   /* Form UnSubscribe services*/
  formunsubscribeservices = function () {
    let scope = this; // somebody uses self 
    try {
      this.unsubobj = {
        servicegroup: '0', unsubtype: '2', partner: '0', reasoncode: '0',  reasonmsg: '', comments: '',
        servicegrplist: [], partnerlist: [],
        servicedetais: [], serviceinfodetails: [], reasoncodelist: [], language: "th", unsubmode: "0"
      }


      scope.unsubobj.reasoncodelist = scope.reasoncodes.filter(function (item) {
        return item.vcreasontype == 'unsub' && item.vclang == "en"
          && (item.vcsubscribertype == scope.accountinfo.subscriber.userType ||
            item.vcsubscribertype == "")
          ;
      });

      this.unsubobj.unsubtype = "2";
      this.selecteditems = [];

      if (this.data && this.data.selectedrows)
        this.selecteditems = this.data.selectedrows;


      if (this.selecteditems.length > 0) {
        this.unsubobj.unsubtype = "1";
      }
       
      if (this.selecteditems.length == 0) {
        this.selecteditems = this.subscriptionsinfo.filter(function (cur) {
          return cur.state != 0;
        });
        //$scope.selecteditems = $scope.subscriptionsinfo;
      }
      if (this.selecteditems.length > 0) {
        var _sgrplist = '';
        for (var i = 0; i < this.selecteditems.length; i++) {
          var _selectObj = this.selecteditems[i];
          var data = this.servicegroups.filter(function (item) {
            return item.id == _selectObj.servicegroup;
          })[0];
          if (data != null) {
            if (_sgrplist.indexOf("," + data.id + ",") == -1) {
              data.id = data.id + "";
              this.unsubobj.servicegrplist.push(data);
              _sgrplist += "," + data.id + ","
            }
          }
        }
        this.unsubobj.servicegroup = this.unsubobj.servicegrplist[0].id;
        //var servicegroup = this.unsubobj.servicegrplist[0].name;
        if (this.unsubobj.servicegroup)
          this.getServiceGroupPartner(this.unsubobj.servicegroup);

        var srvpWiseSubscriptions = [];
        srvpWiseSubscriptions = this.selecteditems.filter(function (item) {
          return item.srvcGrp == scope.unsubobj.servicegroup;
        });
        for (var i = 0; i < srvpWiseSubscriptions.length; i++) {
          var partner = '';
          this.unsubobj.partnerlist.map(function (item) {
            if (item.id == srvpWiseSubscriptions[i].provider_id)
              partner = srvpWiseSubscriptions[i].providername;
          });

          if (partner == null || partner == '') {
            var _partner = { "id": srvpWiseSubscriptions[i].provider_id, "name": srvpWiseSubscriptions[i].providername };
            this.unsubobj.partnerlist.push(_partner);
            partner = null;
          }
        }
        for (var i = 0; i < this.selecteditems.length; i++) {
          var _srvdata = {
            "serviceIdentifier": this.selecteditems[i].srvcCode,
            "productIdentifier": this.selecteditems[i].reqChrgCode,
            "subscriptionId": this.selecteditems[i].serviceId
          }
          this.unsubobj.servicedetais.push(_srvdata);
          this.unsubobj.serviceinfodetails.push(this.selecteditems[i].sname);
        }

        // $scope.unsubobj.reasoncode = $scope.reasoncodelist[0].vcreasoncode;
        this.unsubobj.language = "th";

        this.onChangeLanguage();
        this.unsubobj.reasoncode = "UNSUB001";
        this.SetReasonMessage();
      }
      else {
        this.ccapi.openDialog('error', "Please select Services");
        return;
      }
    }
    catch (e) {
      console.log(e);
    }
    return true;
  }


  unsubscribeserviceslist = function () {
    var $scope = this;
    if ($scope.unsubobj.unsubtype == "2") {
      if ($scope.unsubobj.servicegroup == "0" || $scope.unsubobj.servicegroup == "") {
        this.ccapi.openDialog("error", "Please select service group");
        return;
      }
    }

    const dialogRef = this.dialog.open(ConfirmDialogueBoxComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Please confirm to unsubscribe the service(s)',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

     
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {   //close : true 
          try {

            if ($scope.unsubobj.servicegrplist.length > 0) {
              try {
                 
                //IMIapp.blockui("Unsubscrbing services");
                var requesrParams = {};
                if ($scope.unsubobj.unsubtype == "2" && $scope.unsubobj.partner == "0") {
                  //Selected Services 
                  requesrParams = { "servicegroup": $scope.unsubobj.servicegroup, "reasoncode": $scope.unsubobj.reasoncode, "reasondesc": $scope.unsubobj.reasonmsg, "comments": $scope.unsubobj.comments, partnerid: "0", "unsubmode": $scope.unsubobj.unsubmode }
                  this.ccapi.postData("service/UnsubscribeAllService", requesrParams).subscribe((resp: any) => {
                    if (resp.data.code == "200" && resp.data.status == "success") {
                      this.ccapi.openDialog("success", "Request has been successfully processed");
                       
                     // IMIapp.blockui("Reloading Profile");
                      setTimeout(function () {
                        this.ccfactory.GetAccountInfo().then(function (resp) {
                          if (resp.data.code == "200" && resp.data.status == "success") {
                            $scope.accountinfo = resp.data.data;
                            if ($scope.accountinfo != undefined && $scope.accountinfo != null && $scope.accountinfo != '') {
                              sessionStorage.setItem("accountinfo", JSON.stringify($scope.accountinfo));
                              setTimeout(function () {
                                location.reload();
                              }, 300);
                            }
                            //IMIapp.unblockui();
                          }
                        });
                        setTimeout(function () {
                          //IMIapp.unblockui();
                        }, 2000);
                      }, 4000);
                    }
                    else {
                      this.ccapi.openDialog("error", this.ccapi.ShowJsonErrorMessage(resp));
                      return;
                      //toastrmsg('error', this.ccapi.ShowJsonErrorMessage(resp));
                      //IMIapp.unblockui();
                    }
                  });
                }
                else if ($scope.unsubobj.unsubtype == "2" && $scope.unsubobj.partner != "0") {
                  requesrParams = {};
                  var _messagelst = [];
                  var _maxtime = 0;
                  $scope.partnerwiseserviceunsub = $scope.subscriptionsinfo.filter(function (item, index) {
                    return (item.provider_id == $scope.unsubobj.partner && $scope.getServiceGroupName(item.servicegroup) == $scope.unsubobj.servicegroup);
                  });
                  // $scope.unsubobj.servicedetais = $scope.partnerwiseserviceunsub;
                  if ($scope.partnerwiseserviceunsub == undefined || $scope.partnerwiseserviceunsub.length == 0) {
                    this.ccapi.openDialog("error", "No Services available to unsubscribe");
                    return;
                    //IMIapp.unblockui();
                  }
                  _maxtime = 3000 * $scope.unsubobj.servicedetais.length;
                  for (var i = 0; i < $scope.unsubobj.servicedetais.length; i++) {
                    var unsubpartnersrvc = '';
                    $scope.partnerwiseserviceunsub.map(function (item) {
                      if (item.serviceId == $scope.unsubobj.servicedetais[i].subscriptionId)
                        unsubpartnersrvc = item.serviceId;
                    });
                    if (unsubpartnersrvc != undefined && unsubpartnersrvc != null && unsubpartnersrvc != "") {
                      requesrParams = {
                        //servicelist: $scope.unsubobj.servicedetais[i],
                        productIdentifier: $scope.unsubobj.servicedetais[i].productIdentifier,
                        serviceIdentifier: $scope.unsubobj.servicedetais[i].serviceIdentifier,
                        subscriptionId: $scope.unsubobj.servicedetais[i].subscriptionId,
                        "servicegroup": $scope.unsubobj.servicegroup,
                        "reasoncode": $scope.unsubobj.reasoncode, "reasondesc": $scope.unsubobj.reasonmsg, "comments": $scope.unsubobj.comments,
                        partnerid: $scope.unsubobj.partner, "unsubmode": $scope.unsubobj.unsubmode
                      }

                      //_maxtime = 2000 * i;
                      this.ccapi.postData("service/UnsubscribeService", requesrParams).subscribe((resp: any) => {
                        if (resp.data.code == "200" && resp.data.status == "success") {
                          _messagelst.push("Request for deactivating the service !SERVICENAME! initiated successfully.");
                        }
                        else {
                          _messagelst.push("Request for deactivating the service !SERVICENAME!  failed. " + this.ccapi.ShowJsonErrorMessage(resp));
                        }
                      });
                    }
                  }
                  setTimeout(function () {
                    var _msg = ''
                    for (var i = 0; i < _messagelst.length; i++) {
                      _msg = _msg + (i + 1) + ". " + _messagelst[i].replace("!SERVICENAME!", $scope.unsubobj.serviceinfodetails[i]) + "\r\n";
                    }
                    this.ccapi.openDialog("success", _msg);
                    //IMIapp.unblockui();
                    //IMIapp.blockui("Reloading Profile");
                    setTimeout(function () {
                      this.ccfactory.GetAccountInfo().then(function (resp) {
                        if (resp.data.code == "200" && resp.data.status == "success") {
                          $scope.accountinfo = resp.data.data;
                          if ($scope.accountinfo != undefined && $scope.accountinfo != null && $scope.accountinfo != '') {
                            sessionStorage.setItem("accountinfo", JSON.stringify($scope.accountinfo));
                            setTimeout(function () {
                              location.reload();
                            }, 300);
                          }
                          //IMIapp.unblockui();
                        }
                      });
                      setTimeout(function () {
                        //IMIapp.unblockui();
                      }, 2000);
                    }, 4000);
                  }, _maxtime * 2)

                }
                else {
                  requesrParams = {};
                  var _messagelst = [];
                  var _maxtime = 0;
                  _maxtime = 3000 * $scope.unsubobj.servicedetais.length;
                  for (var i = 0; i < $scope.unsubobj.servicedetais.length; i++) {
                    requesrParams = {
                      //servicelist: $scope.unsubobj.servicedetais[i],
                      productIdentifier: $scope.unsubobj.servicedetais[i].productIdentifier,
                      serviceIdentifier: $scope.unsubobj.servicedetais[i].serviceIdentifier,
                      subscriptionId: $scope.unsubobj.servicedetais[i].subscriptionId,
                      "reasoncode": $scope.unsubobj.reasoncode, "reasondesc": $scope.unsubobj.reasonmsg, "comments": $scope.unsubobj.comments, partnerid: "0", "unsubmode": $scope.unsubobj.unsubmode
                    }


                    this.ccapi.postData("service/UnsubscribeService", requesrParams).subscribe((resp: any) => {
                      if (resp.data.code == "200" && resp.data.status == "success") {
                        _messagelst.push("Request for deactivating the service !SERVICENAME! initiated successfully.");
                      }
                      else {
                        var _tmpmsg = "Request for deactivating the service !SERVICENAME!  failed. " + this.ccapi.ShowJsonErrorMessage(resp);
                        try {

                        }
                        catch (e) { }
                        _messagelst.push(_tmpmsg);
                      }
                    });
                  }
                  setTimeout(function () {
                    var _msg = ''
                    for (var i = 0; i < _messagelst.length; i++) {
                      _msg = _msg + (i + 1) + ". " + _messagelst[i].replace("!SERVICENAME!", $scope.unsubobj.serviceinfodetails[i]) + "\r\n";
                    }
                    this.ccapi.openDialog("success", _msg);
                    //IMIapp.unblockui();

                    //IMIapp.blockui("Reloading Profile");
                    setTimeout(function () {
                      this.ccfactory.GetAccountInfo().then(function (resp) {
                        if (resp.data.code == "200" && resp.data.status == "success") {
                          $scope.accountinfo = resp.data.data;
                          if ($scope.accountinfo != undefined && $scope.accountinfo != null && $scope.accountinfo != '') {
                            sessionStorage.setItem("accountinfo", JSON.stringify($scope.accountinfo));
                            setTimeout(function () {
                              location.reload();
                            }, 300);
                          }
                          //IMIapp.unblockui();
                        }
                      });
                      setTimeout(function () {
                        //IMIapp.unblockui();
                      }, 2000);
                    }, 4000);
                  }, _maxtime * 2)

                }

              }
              catch (e) {
                this.ccapi.openDialog("error", "Internal Error Unable to process your request");
                //IMIapp.unblockui();
              }
            }
          }
          catch (e) {
            //IMIapp.unblockui();
          }

        }
      });
  }


  getServiceGroupPartner = function (servicegroup) {
    var scope = this;
    scope.unsubobj.partnerlist = [];
    var srgrpsubscriptionsinfo = scope.subscriptionsinfo.filter(function (item, index) {
      return (item.servicegroup == servicegroup);
    });
    for (var i = 0; i < srgrpsubscriptionsinfo.length; i++) {
      var partner = '';
      scope.unsubobj.partnerlist.map(function (item) {
        if (item.id == srgrpsubscriptionsinfo[i].provider_id)
          partner = srgrpsubscriptionsinfo[i].providername;
      });
      if (partner == null || partner == '') {
        var _partner = { "id": srgrpsubscriptionsinfo[i].provider_id, "name": srgrpsubscriptionsinfo[i].providername };
        scope.unsubobj.partnerlist.push(_partner);
        _partner = null;
      }
    }
    srgrpsubscriptionsinfo = [];
  }
   

}
