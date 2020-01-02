import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './home.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { MaterialModule } from "../shared/modules/material/material.module";


@NgModule({
  imports: [
    
    CommonModule,
    MaterialModule,
    HomeRoutingModule, FormsModule
  ],
  declarations: [LoginComponent,
    HomeComponent,
    ForgetpasswordComponent, ResetpasswordComponent
   
  ]

})
export class HomeModule { }
