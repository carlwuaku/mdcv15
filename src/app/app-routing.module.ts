import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { authGuard } from './core/auth/auth.guard';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { LoginComponent } from './core/pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  
  {
    path: 'track',
    loadChildren: () =>
      import('./features/delivery-path/delivery-path.module').then(
        (m) => m.DeliveryPathModule
      ),
  },
  {
    path: 'dashboard',
    component: DashboardComponent, canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'cpd', loadChildren: () => import('./features/cpd/cpd.module').then(m => m.CpdModule) },
  { path: 'practitioners', loadChildren: () => import('./features/practitioners/practitioners.module').then(m => m.PractitionersModule) },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: environment.routeTracing,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
