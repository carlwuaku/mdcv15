import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'track',
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
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: environment.debug.routeTracing,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
