import { Component, Input } from '@angular/core';
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
    if (!window.confirm("Are you sure you want to grant these users access to the public portal? If you want to continue you'll need to set their passwords individually.")) {
      return;
    }
    this.notify.showLoading();
    const data: any[] = []
    this.objects.forEach((object) => {
      data.push({
        username: object[this.usernameField],
        email: object.email,
        phone: object.phone,
        display_name: object.display_name || object[this.usernameField],
        user_type: this.userType,
        profile_table: this.profileTableName,
        profile_table_uuid: object.uuid,
      })
    });
    this.dbService.post<{ message: string, details: { status: "success" | "error", message: string, data: string }[] }>("admin/users/non-admin", data).subscribe({
      next: (res) => {
        this.notify.hideLoading();
        const successCount = res.details.filter((item) => item.status === "success").length;
        const errorCount = res.details.filter((item) => item.status === "error").length;

      },
      error: (err) => {
        this.notify.hideLoading();
        this.notify.failNotification(err.error.message);
      }
    })
  }
}
