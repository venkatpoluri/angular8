import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UsermanagementComponent } from './components/usermanagement/usermanagement.component';
import { ServiceManagementComponent } from './components/service-management/service-management.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { BulkuserlistComponent } from './components/bulkuser/bulkuserlist/bulkuserlist.component';
import { CcindexComponent } from './components/ccindex/ccindex.component';
import { ManagerightsComponent } from './components/managerights/managerights.component';
import { CustomercareIndexComponent } from './components/customercare-index/customercare-index.component';
import { GtridTransactionsComponent } from './components/gtrid-transactions/gtrid-transactions.component';

import { SubscriptionsComponent } from './components/trans/subscriptions/subscriptions.component';
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
import { WebaocTransComponent } from './components/trans/webaoc-trans/webaoc-trans.component';
import { CampaignTabComponent } from './components/trans/campaign-tab/campaign-tab.component';
import { AccountInfoComponent } from './components/trans/account-info/account-info.component';
import { PersonalInfoComponent } from './components/trans/personal-info/personal-info.component';

import { MessagingTransComponent } from './components/trans/messaging-trans/messaging-trans.component';  //NEW
import { IvrTransComponent } from './components/trans/ivr-trans/ivr-trans.component';  //NEW
import { SmsTransComponent } from './components/trans/sms-trans/sms-trans.component';
import { RefundTransComponent } from './components/trans/refund-trans/refund-trans.component';
import { UssdTransComponent } from './components/trans/ussd-trans/ussd-trans.component';
import { CampaignTransComponent } from './components/trans/campaign-trans/campaign-trans.component';
import { ChargingTransComponent } from './components/trans/charging-trans/charging-trans.component';
import { AuditlogsComponent } from './components/auditlogs/auditlogs.component';
import { BlockListComponent } from './components/trans/block-list/block-list.component';
import { WhiteListComponent } from './components/trans/white-list/white-list.component';
import { DndProfileComponent } from './components/trans/dnd-profile/dnd-profile.component';
import { BulkprovisionComponent } from './components/bulkprovision/bulkprovision.component';
const routes: Routes = [{
  path: '', component: DashboardComponent, children: [{
    path: 'user', component: UsermanagementComponent
  },
  {
    path: 'service', component: ServiceManagementComponent
  },
  {
    path: 'userslist', component: UsersListComponent
  },
  {
    path: 'myprofile', component: MyprofileComponent
  },
  {
    path: 'bulkuserlist', component: BulkuserlistComponent
  },

  {
    path: 'managerights', component: ManagerightsComponent
  },
  {
    path: 'managerights/:id', component: ManagerightsComponent
  },
  {
    path: 'ccindexsearch', component: CcindexComponent
  },
  {
    path: 'ccindex', component: CustomercareIndexComponent
  },
  {
    path: 'gtridtrans', component: GtridTransactionsComponent
  },
  {
    path: 'subscriptions', component: SubscriptionsComponent
  },
  {
    path: 'profile', component: ProfileComponent, children: [
      {

        path: 'accountinfo', component: AccountInfoComponent
      },
      {

        path: 'personalinfo', component: PersonalInfoComponent
      },
      {

        path: 'blocklist', component: BlockListComponent
      },
      {

        path: 'whitelist', component: WhiteListComponent
      }, {

        path: 'dnd', component: DndProfileComponent
      }

    ]
  },
  {
    path: 'activations', component: ServiceTabComponent
  },
  //{
  //  path: 'chargingtransactions', component: ChargingTabComponent
  //},
  {
    path: 'huaweitransactions', component: HsdpTabComponent
  },
  //{
  //  path: 'refunds', component: RefundsTabComponent
  //},
  //{
  //  path: 'messagingtransactions', component: MessagingTabComponent
  //},
  //{
  //  path: 'smstransactions', component: SmsTabComponent
  //},
  //{
  //  path: 'ussdtransactions', component: UssdTabComponent
  //},
  //{
  //  path: 'ivrtransactions', component: IvrTabComponent
  //},
  {
    path: 'webaoctransactions', component: WebaocTransComponent
  },
  //{
  //  path: 'campaigntransactions', component: CampaignTabComponent
  //},

  //NEW
  {
    path: 'chargingtransactions', component: ChargingTransComponent
  },
  {
    path: 'messagingtransactions', component: MessagingTransComponent
  },
  {
    path: 'ivrtransactions', component: IvrTransComponent
  },
  {
    path: 'smstransactions', component: SmsTransComponent
  },
  {
    path: 'refunds', component: RefundTransComponent
  },
  {
    path: 'ussdtransactions', component: UssdTransComponent
  },
  {
    path: 'campaigntransactions', component: CampaignTransComponent
  },
  {
    path: 'auditlogs', component: AuditlogsComponent
    },
    {
      path: 'bulkprovision', component: BulkprovisionComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
