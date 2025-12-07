import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { authGuard } from './core/auth/auth.guard';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { LoginComponent } from './core/pages/login/login.component';
import { UserResolver } from './core/resolvers/userResolver.service';
import { SearchComponent } from './core/pages/search/search.component';
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './core/pages/forgot-password/forgot-password.component';
import { EnableTwoFactorAuthenticationComponent } from './core/pages/enable-two-factor-authentication/enable-two-factor-authentication.component';
import { InstitutionsListComponent } from './features/training-institutions/components/institutions-list/institutions-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    data: { title: 'Dashboard' },
    resolve: { userData: UserResolver },
    component: DashboardComponent, canActivate: [authGuard]
  },
  {
    path: 'training',
    data: { title: 'Dashboard' },
    resolve: { userData: UserResolver },
    component: InstitutionsListComponent, canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'enable-two-factor-authentication/:uuid',
    component: EnableTwoFactorAuthenticationComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'search',
    component: SearchComponent,
    data: { title: 'Search' }
  },
  {
    path: 'cpd', data: { title: 'Continuous Professional Development' }, resolve: { userData: UserResolver },
    loadChildren: () => import('./features/cpd/cpd.module').then(m => m.CpdModule)
  },
  { path: 'admin', data: { title: "Admin" }, resolve: { userData: UserResolver }, loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
  { path: 'settings', resolve: { userData: UserResolver }, data: { title: 'Settings' }, loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule) },
  { path: 'activities', resolve: { userData: UserResolver }, data: { title: 'Activities' }, loadChildren: () => import('./features/activities/activities.module').then(m => m.ActivitiesModule) },
  { path: 'applications', resolve: { userData: UserResolver }, data: { title: 'Applications' }, loadChildren: () => import('./features/application-forms/application-forms.module').then(m => m.ApplicationFormsModule) },
  { path: 'application-templates', resolve: { userData: UserResolver }, data: { title: 'Application templates' }, loadChildren: () => import('./features/application-templates/application-templates.module').then(m => m.ApplicationTemplatesModule) },
  { path: 'licenses', resolve: { userData: UserResolver }, data: { title: 'Licenses' }, loadChildren: () => import('./features/licenses/licenses.module').then(m => m.LicensesModule) },
  { path: 'applications', resolve: { userData: UserResolver }, data: { title: 'Applications' }, loadChildren: () => import('./features/applications/applications.module').then(m => m.ApplicationsModule) },
  { path: 'messaging', resolve: { userData: UserResolver }, data: { title: 'Messaging' }, loadChildren: () => import('./features/messaging/messaging.module').then(m => m.MessagingModule) },
  { path: 'print-templates', resolve: { userData: UserResolver }, data: { title: 'Templates' }, loadChildren: () => import('./features/print-templates/print-templates.module').then(m => m.PrintTemplatesModule) },
  { path: 'housemanship', resolve: { userData: UserResolver }, data: { title: 'Housemanship' }, loadChildren: () => import('./features/housemanship/housemanship.module').then(m => m.HousemanshipModule) },
  { path: 'examinations', resolve: { userData: UserResolver }, data: { title: 'Examinations' }, loadChildren: () => import('./features/examinations/examinations.module').then(m => m.ExaminationsModule) },
  { path: 'payment', resolve: { userData: UserResolver }, data: { title: 'Payments' }, loadChildren: () => import('./features/payment/payment.module').then(m => m.PaymentModule) },
  { path: 'training-institutions', resolve: { userData: UserResolver }, data: { title: 'Training Institutions' }, loadChildren: () => import('./features/training-institutions/training-institutions.module').then(m => m.TrainingInstitutionsModule) },
  { path: 'apimanagement', resolve: { userData: UserResolver }, data: { title: 'API Management' }, loadChildren: () => import('./features/apimanagement/apimanagement.module').then(m => m.ApiManagementModule) },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: environment.routeTracing,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
