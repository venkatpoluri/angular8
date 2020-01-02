import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CcapiService } from "./shared/services/ccapi.service";
import { DecimalNumberDirective } from './shared/directives/decimal-number';
import { TitleCharsDirective } from './shared/directives/title-chars';
import { IpsDirective } from './shared/directives/ips';
import { SafeCharsDirective } from './shared/directives/safe-chars';
import { PercentageDirective } from './shared/directives/percentage';
import { NumbersOnlyDirective } from './shared/directives/numbersonly';
import { SearchFilterPipe } from './shared/pipes/searchfilter';
import { MaterialModule } from "./shared/modules/material/material.module";
import { MsgdialogueboxComponent } from './shared/msgdialoguebox/msgdialoguebox.component';
import { ConfirmDialogueBoxComponent } from './shared/confirm-dialogue-box/confirm-dialogue-box.component';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
 
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { UploadFileDialogComponent } from './shared/upload-file-dialog/upload-file-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
 
import { CcfactoryService } from "./shared/services/ccfactory.service";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DecimalNumberDirective,
    TitleCharsDirective,
    SafeCharsDirective,
    PercentageDirective,
    NumbersOnlyDirective,
    IpsDirective,
    SearchFilterPipe,
    MsgdialogueboxComponent,
    ConfirmDialogueBoxComponent
    //UploadFileDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    MaterialModule,
    FileUploadModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })


  ],
  providers: [
    CcapiService, TranslateService, CcfactoryService
  ],

  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmDialogueBoxComponent, MsgdialogueboxComponent
  ]
})
export class AppModule { }

