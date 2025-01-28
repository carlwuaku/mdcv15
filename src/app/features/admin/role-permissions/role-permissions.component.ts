import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../models/roles.model';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { Permissions } from '../models/permissions.model';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.scss']
})
export class RolePermissionsComponent implements OnInit {
  id: string;
  role?: Role
  permissions: Permissions[] = [];
  excludedPermissions: Permissions[] = [];
  constructor(ar: ActivatedRoute, private router: Router, private dbService: HttpService, private notify: NotifyService) {
    this.id = ar.snapshot.params['id'];
    if (!this.id) {
      alert('No role identified');
      this.router.navigate(['/admin/roles'])
    }
  }
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.notify.showLoading();
    this.dbService.get<{ data: Role, permissions: Permissions[], excludedPermissions: Permissions[] }>(`admin/roles/${this.id}`).subscribe(
      {
        next: data => {
          //for each key, find the corresponding field and set the value
          this.role = data.data;
          this.permissions = data.permissions;
          this.excludedPermissions = data.excludedPermissions
          this.notify.hideLoading();
        },
        error: error => {
          this.notify.failNotification("Error loading data. Please try again")
        }
      })
  }

  addPermission(permission: Permissions) {
    if (!window.confirm(`Grant ${permission.name} to ${this.role?.role_name}?`)) {
      return;
    }
    this.notify.showLoading();
    const data = new FormData();
    data.append("role", this.role!.role_name);
    data.append("permission", permission.name)
    this.dbService.post<{ message: string }>(`admin/rolePermissions`, data).subscribe(
      {
        next: data => {
          this.getData();
          this.notify.successNotification(data.message)
          this.notify.hideLoading();
        },
        error: error => {
        }
      })
  }

  removePermission(permission: Permissions) {
    if (!window.confirm(`Remove ${permission.name} from ${this.role?.role_name}?`)) {
      return;
    }
    this.notify.showLoading();
    this.dbService.delete<{ message: string }>(`admin/rolePermissions/${this.role!.role_name}/${permission.name}`).subscribe(
      {
        next: data => {
          this.getData();
          this.notify.successNotification(data.message)
          this.notify.hideLoading();
        },
        error: error => {
        }
      })
  }

}
