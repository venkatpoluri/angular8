import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
const routes: Routes = [
  {
    path: '', children: [
      {
        path: '', component: LoginComponent
      },
      {
        path: 'forgotpwd', component: ForgetpasswordComponent
      },
      {
        path: 'resetpassword/:guid', component: ResetpasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
