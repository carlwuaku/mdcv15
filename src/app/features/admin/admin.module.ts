import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
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
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    UserFormComponent,
    RolesComponent,
    RoleFormComponent,
    RolePermissionsComponent,
    RegisteredUsersComponent,
    AppSettingsManagerComponent,
    FailedActionsManagerComponent,
    ActionsAuditComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
