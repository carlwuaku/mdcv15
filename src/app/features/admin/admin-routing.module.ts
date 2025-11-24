import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './user-form/user-form.component';
import { RolesComponent } from './roles/roles.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { RolePermissionsComponent } from './role-permissions/role-permissions.component';
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import { PermissionsGuard } from 'src/app/core/auth/permissions.guard';

const routes: Routes = [
  { path: '', component: AdminComponent },
  {
    path: 'users', data: { title: 'System Users', permission: 'View_Users' }, component: UsersComponent, canActivate: [PermissionsGuard],
  },
  {
    path: 'registered-users', data: { title: 'Registered Users', permission: 'View_Users' }, component: RegisteredUsersComponent, canActivate: [PermissionsGuard],
  },
  { path: 'userForm', data: { title: 'Add a new user', permission: 'Create_Or_Edit_User' }, component: UserFormComponent, canActivate: [PermissionsGuard] },
  { path: 'userForm/:id', data: { title: 'Edit user', permission: 'View_Users' }, component: UserFormComponent, canActivate: [PermissionsGuard] },
  { path: 'roles', data: { title: 'User Roles', permission: 'View_User_Roles' }, component: RolesComponent, canActivate: [PermissionsGuard] },
  { path: 'role-form', data: { title: 'Add a new role', permission: 'Create_Or_Edit_User_Role' }, component: RoleFormComponent, canActivate: [PermissionsGuard] },
  { path: 'role-form/:id', data: { title: 'Edit role details', permission: 'Create_Or_Edit_User_Role' }, component: RoleFormComponent, canActivate: [PermissionsGuard] },
  { path: 'role-permissions/:id', data: { title: 'Edit role permissions', permission: 'Create_Or_Delete_User_Permissions' }, component: RolePermissionsComponent, canActivate: [PermissionsGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
