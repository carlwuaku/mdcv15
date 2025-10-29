import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { SharedModule } from '../shared/shared.module';
import { RecaptchaModule } from "ng-recaptcha";
import { SearchComponent } from './pages/search/search.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { EnableTwoFactorAuthenticationComponent } from './pages/enable-two-factor-authentication/enable-two-factor-authentication.component';


@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    LogoutComponent,
    SearchComponent,
    PageNotFoundComponent,
    ForgotPasswordComponent,
    EnableTwoFactorAuthenticationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecaptchaModule,
    RouterModule,
    MatGridListModule
  ],
  exports: [LoginComponent]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        "CoreModule is already loaded. Import it in the AppModule only."
      );
    }
  }
}
