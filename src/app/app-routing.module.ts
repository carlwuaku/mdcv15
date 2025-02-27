import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { authGuard } from './core/auth/auth.guard';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { LoginComponent } from './core/pages/login/login.component';
import { UserResolver } from './core/resolvers/userResolver.service';
import { SearchComponent } from './core/pages/search/search.component';
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component';

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
    path: 'login',
    component: LoginComponent
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
  // { path: 'practitioners', data: { title: 'Practitioners' }, loadChildren: () => import('./features/practitioners/practitioners.module').then(m => m.PractitionersModule) },
  { path: 'admin', data: { title: "Admin" }, resolve: { userData: UserResolver }, loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
  { path: 'settings', resolve: { userData: UserResolver }, data: { title: 'Settings' }, loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule) },
  { path: 'activities', resolve: { userData: UserResolver }, data: { title: 'Activities' }, loadChildren: () => import('./features/activities/activities.module').then(m => m.ActivitiesModule) },
  { path: 'applications', resolve: { userData: UserResolver }, data: { title: 'Applications' }, loadChildren: () => import('./features/application-forms/application-forms.module').then(m => m.ApplicationFormsModule) },
  { path: 'application-templates', resolve: { userData: UserResolver }, data: { title: 'Application templates' }, loadChildren: () => import('./features/application-templates/application-templates.module').then(m => m.ApplicationTemplatesModule) },
  { path: 'licenses', resolve: { userData: UserResolver }, data: { title: 'Licenses' }, loadChildren: () => import('./features/licenses/licenses.module').then(m => m.LicensesModule) },
  { path: 'applications', resolve: { userData: UserResolver }, loadChildren: () => import('./features/applications/applications.module').then(m => m.ApplicationsModule) },
  { path: 'messaging', loadChildren: () => import('./features/messaging/messaging.module').then(m => m.MessagingModule) },
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
