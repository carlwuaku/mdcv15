import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { SharedModule } from '../shared/shared.module';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha-2';
import { SearchComponent } from './pages/search/search.component';
import { LicensesModule } from '../features/licenses/licenses.module';
import { PractitionersModule } from '../features/practitioners/practitioners.module';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    LogoutComponent,
    SearchComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    PractitionersModule,
    LicensesModule,
    FormsModule,
    ReactiveFormsModule
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
