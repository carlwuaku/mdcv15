import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './user-form/user-form.component';
import { RolesComponent } from './roles/roles.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { RolePermissionsComponent } from './role-permissions/role-permissions.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
{ path: 'users', data:  {title: 'System Users'}, component: UsersComponent },
{ path: 'userForm', data: {title: 'Add a new user'}, component: UserFormComponent },
{ path: 'userForm/:id', data:{title: 'Edit user'}, component: UserFormComponent },
{path: 'roles', data:  {title: 'User Roles'}, component: RolesComponent },
{ path: 'role-form', data: {title: 'Add a new role'}, component: RoleFormComponent },
{ path: 'role-form/:id', data:{title: 'Edit role details'}, component: RoleFormComponent },
{ path: 'role-permissions/:id', data:{title: 'Edit role permissions'}, component: RolePermissionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
