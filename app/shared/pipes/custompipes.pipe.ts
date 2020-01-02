import { Pipe, PipeTransform } from '@angular/core';
import { CcfactoryService } from '../services/ccfactory.service';
import { planSubStatus, planUserStatus, AllowedChannels, SubscriberClass, NetworkType, SubscriberType, ChargeType, GetProductTypes, PriceModel } from '../../shared/models/enums.model';
import * as _moment from 'moment';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Pipe({
  name: 'servicegroupbyid'
})
export class ServiceGroupByIdPipe implements PipeTransform {

  constructor(private ccfactory: CcfactoryService) { }
  private servicegroups = this.ccfactory.getServiceGroups().then((res: any) => {
    return res;
  });
  transform(value: string): string {

    if (this.servicegroups && this.servicegroups['__zone_symbol__value']) {
      var data = this.servicegroups['__zone_symbol__value'].filter(function (element, index) {
        return (element.id == value);
      })[0];

      if (data && data.name)
        return data.name;
    }

    return value;
  }
}



@Pipe({
  name: 'customstatus'
})
export class CustomStatusPipe implements PipeTransform {

  _activelist = ["1"];  //--> add to bind green badge
  _inactivelist = ["0"];  //--> add to bind red badge
  transform(value: string): string {
    if (value && this._activelist.includes(value.toString()))
      return '<span class="badge badge-success">ACTIVE</span>'
    if (value && this._inactivelist.includes(value.toString()))
      return '<span class="badge badge-danger">INACTIVE</span>'
    return value;
  }
}

@Pipe({
  name: 'customallowedchannels'
})
export class CustomAllowedChannels implements PipeTransform {
  transform(_value: string): any {
    var channels = _value.split(',');
    var value = "";
    channels.forEach(function (element) {
      if (element)
        value += AllowedChannels[element] + ",";
    });
    if (value) {
      return value.replace(/(^,)|(,$)/g, "").replace(/(,$)/g, "");
    }
    else {
      return _value
    }
  }
}

@Pipe({ name: 'customsubscriberclass' })
export class CustomScriberClass implements PipeTransform {
  transform(key: string): any {
    if (key) {
      var value = SubscriberClass[key];
    }
    if (value) {
      return value;
    }
    else {
      return key;
    }
  }
}

@Pipe({ name: 'customnetworktype' })
export class CustomNetworkType implements PipeTransform {
  transform(key: string): any {
    if (key) {
      var value = NetworkType[key];
    }
    if (value) {
      return value;
    }
    else {
      return key;
    }
  }
}

@Pipe({ name: 'customsubscribertype' })
export class CustomSubscriberType implements PipeTransform {
  transform(key: string): any {
    if (key) {
      var value = SubscriberType[key];
    }
    if (value) {
      return value;
    }
    else {
      return key;
    }
  }
}

@Pipe({ name: 'customchargetypebyidpipe' })
export class CustomChargeType implements PipeTransform {
  transform(key: string): any {
    if (key) {
      var value = ChargeType[key];
    }
    if (value) {
      return value;
    }
    else {
      return key;
    }
  }
}

@Pipe({ name: 'customproducttypebyidpipe' })
export class CustomProductType implements PipeTransform {
  transform(key: string): any {
    if (key) {
      var value = GetProductTypes[key];
    }
    if (value) {
      return value;
    }
    else {
      return key;
    }
  }
}

@Pipe({ name: 'custompricemodelbyidpipe' })
export class CustomPriceModel implements PipeTransform {
  transform(key: string): any {
    if (key) {
      var value = PriceModel[key];
    }
    if (value) {
      return value;
    }
    else {
      return key;
    }
  }
}

@Pipe({
  name: 'userstatusbyproduct'
})
export class userStatusByProductPipe implements PipeTransform {
  transform(row: string, ustate, usubStatus): string {
    try {
      var _html = '';
      var _ustate = row[ustate] ? row[ustate].toString() : '';
      var status = planUserStatus[_ustate];
      if (status.toLowerCase() == 'active')
        _html = '<div class="badge badge-success">' + status + '</div>';
      else
        _html = '<div class="badge badge-danger">' + status + '</div>';
      try {
        var _substs = row[usubStatus] + "";
        if (_substs != null && _substs != null && (_substs).length > 0) {
          var _usubStatus = row[usubStatus] ? row[usubStatus].toString() : '';
          var _substatusmsg = planSubStatus[_usubStatus];
          if (_substatusmsg.length > 2) {
            _html += ' <br/>  <br/>    <div class="badge badge-warning">' + _substatusmsg + '</div>';
          }
        }
      } catch (e) { }
      return _html;

    }
    catch (e) { }
    return '';
  }
}

@Pipe({ name: 'customdateformat' })
export class CustomDateFormatPipe implements PipeTransform {
 // public moment = new moment();
  transform(date: string, sourceformat, destformat): string {

    var convertdate = '';

    if (!destformat) {
      destformat = "YYYY-MM-DD HH:mm:ss";
    }


    if (!sourceformat) {
      convertdate = moment(date).format(destformat);
    }
    else {
      convertdate = moment(date, sourceformat).format(destformat);
    }

    if (convertdate == 'Invalid date') {
      convertdate = date;
    }

    if (!convertdate) {
      convertdate = "";
    }

    return convertdate;
  }
}


//export enum planSubStatus {
// "ACTIVE12"  = "1"
//}
