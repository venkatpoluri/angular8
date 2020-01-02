import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from "../shared/modules/material/material.module";
import { UsermanagementComponent } from './components/usermanagement/usermanagement.component';
import { ServiceManagementComponent } from './components/service-management/service-management.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { BulkuserlistComponent } from './components/bulkuser/bulkuserlist/bulkuserlist.component';
import { UploadbulkuserComponent } from './components/bulkuser/uploadbulkuser/uploadbulkuser.component';
import { CcindexComponent } from './components/ccindex/ccindex.component';

//PIPES
import { LangFilterPipe } from '../shared/pipes/languagefilter';
import { ServiceGroupByIdPipe, CustomChargeType, CustomProductType, CustomPriceModel } from '../shared/pipes/custompipes.pipe';
import { CustomStatusPipe } from '../shared/pipes/custompipes.pipe';
import { userStatusByProductPipe } from '../shared/pipes/custompipes.pipe';
import { CustomAllowedChannels } from '../shared/pipes/custompipes.pipe';
import { CustomScriberClass } from '../shared/pipes/custompipes.pipe';
import { CustomNetworkType } from '../shared/pipes/custompipes.pipe';
import { CustomSubscriberType } from '../shared/pipes/custompipes.pipe';
import { CustomDateFormatPipe } from '../shared/pipes/custompipes.pipe';


import { DataTablesModule } from 'angular-datatables';
import { ManagerightsComponent } from './components/managerights/managerights.component';
import { CreateUserDialogComponent } from './components/create-user-dialog/create-user-dialog.component';
import { StatusgraphComponent } from './components/bulkuser/statusgraph/statusgraph.component';
import { CustomercareIndexComponent } from './components/customercare-index/customercare-index.component';
import { GtridTransactionsComponent } from './components/gtrid-transactions/gtrid-transactions.component';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SubscriptionsComponent } from './components/trans/subscriptions/subscriptions.component';
import { UnsubServicesComponent } from './components/trans/subscriptions/unsub-services/unsub-services.component';
import { ProfileComponent } from './components/trans/profile/profile.component';
import { ServiceTabComponent } from './components/trans/service-tab/service-tab.component';
import { ChargingTabComponent } from './components/trans/charging-tab/charging-tab.component';
import { HsdpTabComponent } from './components/trans/hsdp-tab/hsdp-tab.component';
import { RefundsTabComponent } from './components/trans/refunds-tab/refunds-tab.component';
import { MessagingTabComponent } from './components/trans/messaging-tab/messaging-tab.component';
import { SmsTabComponent } from './components/trans/sms-tab/sms-tab.component';
import { UssdTabComponent } from './components/trans/ussd-tab/ussd-tab.component';
import { IvrTabComponent } from './components/trans/ivr-tab/ivr-tab.component';
import { WebaocTabComponent } from './components/trans/webaoc-tab/webaoc-tab.component';
import { CampaignTabComponent } from './components/trans/campaign-tab/campaign-tab.component';
import { TransHeaderComponent } from './components/trans/trans-header/trans-header.component';
import { AccountInfoComponent } from './components/trans/account-info/account-info.component';
import { PersonalInfoComponent } from './components/trans/personal-info/personal-info.component';
import { ServiceDetailsDialogComponent } from './components/trans/service-details-dialog/service-details-dialog.component';
import { UploadFileDialogComponent } from  './components/bulkuser/upload-file-dialog/upload-file-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MessagingTransComponent } from './components/trans/messaging-trans/messaging-trans.component';
import { IvrTransComponent } from './components/trans/ivr-trans/ivr-trans.component';
import { RefundTransComponent } from './components/trans/refund-trans/refund-trans.component';

import { MatToolbarModule, MatInputModule, MatTableModule, MatSortModule } from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination'; 
 
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ChargingDetailsComponent } from './components/trans/service-details-dialog/charging-details/charging-details.component';
import { NotificationDetailsComponent } from './components/trans/service-details-dialog/notification-details/notification-details.component';
import { AlertsComponent } from './components/trans/service-details-dialog/alerts/alerts.component';
import { ServiceRequestsComponent } from './components/trans/service-details-dialog/service-requests/service-requests.component';

import { TruncateModule } from 'ng2-truncate';
import { TruncatedTextComponent } from '../shared/truncated-text/truncated-text.component';
import { SmsTransComponent } from './components/trans/sms-trans/sms-trans.component';
import { UssdTransComponent } from './components/trans/ussd-trans/ussd-trans.component';
import { WebaocTransComponent } from './components/trans/webaoc-trans/webaoc-trans.component';
import { CampaignTransComponent } from './components/trans/campaign-trans/campaign-trans.component';
import { ResetpasswordComponent } from './components/users-list/resetpassword/resetpassword.component';
import { ChargingTransComponent } from './components/trans/charging-trans/charging-trans.component';
import { RefundDialogComponent } from './components/trans/charging-trans/refund-dialog/refund-dialog.component';
import { AuditlogsComponent } from './components/auditlogs/auditlogs.component';
import { BlockListComponent } from './components/trans/block-list/block-list.component';
import { GroupBlockListDialogComponent } from './components/trans/group-block-list-dialog/group-block-list-dialog.component';
import { ServiceBlockListDialogComponent } from './components/trans/service-block-list-dialog/service-block-list-dialog.component';
import { WhiteListComponent } from './components/trans/white-list/white-list.component';
import { GroupWhiteListDialogComponent } from './components/trans/group-white-list-dialog/group-white-list-dialog.component';
import { ServiceWhiteListDialogComponent } from './components/trans/service-white-list-dialog/service-white-list-dialog.component';
import { DndProfileComponent } from './components/trans/dnd-profile/dnd-profile.component';
import { AddDndDialogComponent } from './components/trans/add-dnd-dialog/add-dnd-dialog.component';
import { ProductdetailsComponent } from './components/trans/service-tab/product-details/product-details.component';
import { WhitedetailsDialogComponent } from './components/trans/whitedetails-dialog/whitedetails-dialog.component';
import { BlockdetailsDialogComponent } from './components/trans/blockdetails-dialog/blockdetails-dialog.component';
import { BulkprovisionComponent } from './components/bulkprovision/bulkprovision.component';



export function HttpLoaderFactory(http: HttpClient) {

  return new TranslateHttpLoader(http, 'assets/i18n/i18n/', '.json');
  
}


@NgModule({
  imports: [
    HttpClientModule,
    MatToolbarModule, MatInputModule, MatTableModule,
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    FileUploadModule,
    MatSortModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TruncateModule, 
TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  //exports: [CommonModule, MatToolbarModule, MatInputModule, MatTableModule],
  declarations: [
    HeaderComponent,
    DashboardComponent,
    UsermanagementComponent,
    ServiceManagementComponent,
    UsersListComponent,
      MyprofileComponent,
      BulkuserlistComponent,
    CcindexComponent,
    LangFilterPipe,
    ServiceGroupByIdPipe,
    CustomStatusPipe,
    userStatusByProductPipe,
    ManagerightsComponent,
    UploadbulkuserComponent,
    CreateUserDialogComponent,
    StatusgraphComponent,
    CustomercareIndexComponent,
    GtridTransactionsComponent,
    SubscriptionsComponent,
    UnsubServicesComponent,
    ProfileComponent,
    ServiceTabComponent,
    ChargingTabComponent,
    HsdpTabComponent,
    RefundsTabComponent,
    MessagingTabComponent,
    SmsTabComponent,
    UssdTabComponent,
    IvrTabComponent,
    WebaocTabComponent,
    CampaignTabComponent,
    TransHeaderComponent,
    AccountInfoComponent,
    PersonalInfoComponent,
    ServiceDetailsDialogComponent,
    UploadFileDialogComponent,
    MessagingTransComponent,
    ChargingDetailsComponent,
    NotificationDetailsComponent,
    TruncatedTextComponent,
    IvrTransComponent,
    RefundTransComponent,
    SmsTransComponent,
    UssdTransComponent,
    WebaocTransComponent,
    CampaignTransComponent,
    ResetpasswordComponent,
    AlertsComponent,
    ServiceRequestsComponent,
    ChargingTransComponent,
    RefundDialogComponent,
    AuditlogsComponent,
    BlockListComponent,
    GroupBlockListDialogComponent,
    ServiceBlockListDialogComponent,
    WhiteListComponent,
    GroupWhiteListDialogComponent,
    ServiceWhiteListDialogComponent,
    DndProfileComponent,
    AddDndDialogComponent,
    ProductdetailsComponent,
    WhitedetailsDialogComponent,
    BlockdetailsDialogComponent,
    CustomAllowedChannels,
    CustomScriberClass,
    CustomNetworkType,
    CustomScriberClass,
    CustomChargeType,
    CustomProductType,
    CustomPriceModel,
    CustomSubscriberType,
    CustomDateFormatPipe,
    BulkprovisionComponent
  ],

  entryComponents: [
    CreateUserDialogComponent,
    UploadbulkuserComponent,
    StatusgraphComponent,
    ServiceDetailsDialogComponent,
    GroupBlockListDialogComponent,
    ServiceBlockListDialogComponent,
    GroupWhiteListDialogComponent,
    ServiceWhiteListDialogComponent,
    AddDndDialogComponent,
    ResetpasswordComponent,
    UnsubServicesComponent,
    WhitedetailsDialogComponent,
    BlockdetailsDialogComponent,
    ProductdetailsComponent,
    RefundDialogComponent
  ]

})
   

export class DashboardModule { }
