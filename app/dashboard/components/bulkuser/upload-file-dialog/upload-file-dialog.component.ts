import { Component, Inject, OnInit, Attribute, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CcapiService } from "../../../../shared/services/ccapi.service";
import { HttpClient } from '@angular/common/http';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { MsgdialogueboxComponent } from 'src/app/shared/msgdialoguebox/msgdialoguebox.component';
 

export interface DialogData {
  maxsizemb: any;
}

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.css']
})
export class UploadFileDialogComponent {
   public data: any;
  public maxsizemb: any = 100;
  public tempCode: any;
  public datetime: any;
  public interval: any;
  public uploader: FileUploader = new FileUploader({ url: this.ccapi.getUrl('others/uploadfiles') });
  public fileUpload: boolean = false;
  filenameupload: string;
  @Output() uploadedresp = new EventEmitter<string>();
  //@Input() uploadparams: any[];


  constructor(public dialog: MatDialog, private http: HttpClient, private ccapi: CcapiService, private dialogRef: MatDialogRef<UploadFileDialogComponent>) {
    this.uploader = new FileUploader({ url: this.ccapi.getUrl('user/UploadBulkUserData') });
    this.data = {
      filecode: this.getfileCode(),
    }
     
  } 

  getfileCode() {
    var currentdate = new Date();
    this.datetime =
      currentdate.getHours() + ""
      + currentdate.getMinutes() + ""
      + currentdate.getSeconds() + ""
      + currentdate.getMilliseconds();
    return this.ccapi.getAccessKey() + this.datetime;
  }
  ngOnInit(): void {
    let fileSizeInMb: number = 0;
    let queueLimit = 100;
    //console.log(this.dgdata.maxsizemb);
    this.uploader = new FileUploader({
      url: this.ccapi.getUrl('user/UploadBulkUserData'),
      isHTML5: true,
      //maxFileSize: parseInt(this.dgdata.maxsizemb) * 1024 * 1024,
      queueLimit: queueLimit,
      headers: [{ name: 'filecode', value: this.data.filecode },
        { name: 'accesskey', value: this.ccapi.getAccessKey() },
        { name: 'csrftoken', value: this.ccapi.getCsrfKey() },
      { name: 'statename', value: 'fileupload' }],
      allowedMimeType: ['text/plain', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    });

    this.uploader.onAfterAddingAll = (addedFileItems) => {
      let fileSizeInMb = 0;
      for (let i = 0; i < this.uploader.queue.length; i++) {
        fileSizeInMb += this.uploader.queue[i].file.size;
        this.tempCode = fileSizeInMb;
      }
      if (fileSizeInMb > (parseInt(this.maxsizemb) * 1024 * 1024)) {
        this.fileUpload = false;
        //this.uploader.clearQueue();
        this.dialog.open(MsgdialogueboxComponent, {
          disableClose: true,
          width: '400px',
          data: { type: alert, msg: 'Upload File(s) size should not exceed more than' + '' + this.maxsizemb + 'MB' }
        });
      }
      else {
        this.fileUpload = true;
      }
    };

    this.uploader.onBeforeUploadItem = (item) => {
      console.log("onBeforeUploadItem", item);
     item.withCredentials = false;
    };
    //this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
    //  form.append('uploadlimit', fileSizeInMb);
    //};

    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

    this.interval = setInterval(() => {
      if (this.ccapi.getUserName() == 'NA') {
        window.location.reload();
        //this.dialogRef.close();
      }
    }, 5000);

  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response);
    console.log(response);
    this.uploadedresp.emit(data.data);
    this.data.filecode = data.data;
  }
  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let error = JSON.parse(response);
  }

  save(uploadedCount) {
    if (uploadedCount > 0) {
      if (this.data.filecode == "NO_FILES_FOUND" || this.data.filecode == "" || this.data.filecode == null || this.data.filecode == undefined) {
        this.dialog.open(MsgdialogueboxComponent, {
          disableClose: true,
          width: '400px',
          data: { type: alert, msg: 'Please upload atleast one valid file.'}
        });
      }
      else {
        var uploadinfo = [{ code: this.data.filecode, length: uploadedCount, filenames: this.uploader.queue }];
        this.dialogRef.close(uploadinfo);
      }
    }
    else {
      this.dialogRef.close('');
    }
  }
  //deleteFile() {
  //  const index: number = this.data.indexOf();
  //  if (index !== -1) {
  //    this.data.splice(index, 1);
  //  }        
  //}
  checkItem() {
    let fileSizeInMb = 0;
    for (let i = 0; i < this.uploader.queue.length; i++) {
      fileSizeInMb += this.uploader.queue[i].file.size;
      this.tempCode = fileSizeInMb;
    }
    //console.log(this.tempCode);
    if (fileSizeInMb > (parseInt(this.maxsizemb) * 1024 * 1024)) {
      this.fileUpload = false;
      //this.uploader.clearQueue();
      this.dialog.open(MsgdialogueboxComponent, {
        disableClose: true,
        width: '400px',
        data: { type: alert, msg: 'Upload File(s) size should not exceed more than' + '' + this.maxsizemb + 'MB' }
      });
    }
    else {
      this.fileUpload = true;
    }
  }
  convertTime() {

  }
  close() {
    this.dialogRef.close('');
  }
  clearQueue() {
    this.data = {
      filecode: this.getfileCode()
    }
  }

  ngOnDestroy() {
    try {
      if (this.interval) {
        clearInterval(this.interval);
      }
    } catch (e) { }
  }

  getExtn(fileName: string): string {
    return fileName.lastIndexOf('.') > -1 ? fileName.substring(fileName.lastIndexOf('.')) : "";
  }

}
