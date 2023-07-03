import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryPageComponent } from './pages/delivery-page/delivery-page.component';
import { MapViewComponent } from './pages/map-view/map-view.component';

const routes: Routes = [
  {
    path: '',
    component: DeliveryPageComponent,
  },
  {
    path:'map',
    component: MapViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryPathRoutingModule {}
