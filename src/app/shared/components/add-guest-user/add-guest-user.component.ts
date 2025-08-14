import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from '../form-generator/form-generator-interface';

@Component({
  selector: 'app-add-guest-user',
  templateUrl: './add-guest-user.component.html',
  styleUrls: ['./add-guest-user.component.scss']
})
export class AddGuestUserComponent {
  @Input() objects: any[] = [];
  @Input() profileTableName: string = "";
  @Input() userType: string = "";
  @Input() usernameField: string = "username";
  @Input() usernameFieldLabel: string = "Username";
  @Input() displayNameFields: string[] = ["name"];
  @ViewChild("addGuestUserDialog") addGuestUserDialog: TemplateRef<any> | null = null;
  formFields: IFormGenerator[] = [
    {
      label: "Two-factor authentication deadline",
      name: "two_factor_deadline",
      hint: "",
      options: [],
      type: "date",
      value: "",
      required: true
    }
  ]
  constructor(private dbService: HttpService, private notify: NotifyService) { }

  addGuestUser() {
    if (this.objects.length === 0) {
      this.notify.failNotification("No users to add");
      return;
    }
    if (this.profileTableName === "") {
      this.notify.failNotification("No profile table name provided");
      return;
    }
    if (this.userType === "") {
      this.notify.failNotification("No user type provided");
      return;
    }
    if (!window.confirm("Are you sure you want to grant these users access to the public portal?")) {
      return;
    }
    this.notify.showLoading();
    const data: any[] = []
    this.objects.forEach((object) => {
      data.push({
        username: object[this.usernameField],
        email: object.email,
        phone: object.phone,
        display_name: this.displayNameFields.map((field) => object[field]).join(" "),
        user_type: this.userType,
        profile_table: this.profileTableName,
        profile_table_uuid: object.uuid,
      })
    });
    this.dbService.post<{ message: string, details: { status: "success" | "error", message: string, data: string }[] }>("admin/users/non-admin", data).subscribe({
      next: (res) => {
        this.notify.hideLoading();
        const successCount = res.details.filter((item) => item.status === "success").length;
        const errors = res.details.filter((item) => item.status === "error");
        if (successCount > 0) {
          this.notify.successNotification(`${successCount} user(s) added successfully`);
        }
        if (errors.length > 0) {
          let message = "";
          errors.forEach((error) => {
            message += `${error.message}<br>`;
          })
          this.notify.warningAlertNotification(`${errors.length} user(s) accounts could not be created`, message);
        }
      },
      error: (err) => {
        this.notify.hideLoading();
        this.notify.failNotification(err.error.message);
      }
    })
  }
}
