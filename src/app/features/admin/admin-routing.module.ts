import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
{ path: 'users', data:  {title: 'System Users'}, component: UsersComponent },
{ path: 'userForm', data: {title: 'Add a new user'}, component: UserFormComponent },
{ path: 'userForm/:id', data:{title: 'Edit user'}, component: UserFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
