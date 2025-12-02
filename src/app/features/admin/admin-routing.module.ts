import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './user-form/user-form.component';
import { RolesComponent } from './roles/roles.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { RolePermissionsComponent } from './role-permissions/role-permissions.component';
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import { AppSettingsManagerComponent } from './app-settings-manager/app-settings-manager.component';
import { FailedActionsManagerComponent } from './failed-actions-manager/failed-actions-manager.component';
import { ActionsAuditComponent } from './actions-audit/actions-audit.component';
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
  { path: 'app-settings', data: { title: 'App Settings Manager', permission: 'View_Settings' }, component: AppSettingsManagerComponent, canActivate: [PermissionsGuard] },
  { path: 'failed-actions', data: { title: 'Failed Actions Manager', permission: 'View_Settings' }, component: FailedActionsManagerComponent, canActivate: [PermissionsGuard] },
  { path: 'actions-audit', data: { title: 'Actions Audit Trail', permission: 'View_Settings' }, component: ActionsAuditComponent, canActivate: [PermissionsGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
