import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator, PractitionerCategories, monthsOptions } from 'src/app/shared/components/form-generator/form-generator-interface';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  title: string = "Add a new user";
  formUrl: string = "admin/users";
  existingUrl: string = "admin/users";
  userTypeChanged = (userType: string) => {
    //if it's admin, set required on role_name to true, else false
    if (userType === "admin") {
      this.fields.map(field => {
        if (field.name === "role_name") {
          field.required = true;
          field.disabled = ""

        }
      })
    }
    else {
      this.fields.map(field => {
        if (field.name === "role_name") {
          field.required = false;
          field.disabled = "disabled"
        }
      })
    }
  }

  fields: IFormGenerator[] = [
    {
      label: "User type",
      name: "user_type",
      hint: "",
      options: [],
      type: "api",
      value: "",
      required: true,
      api_url: "admin/users/types",
      apiKeyProperty: "value",
      apiLabelProperty: "key",
      apiType: "select",
      onChange: this.userTypeChanged
    },
    {
      label: "Username",
      name: "username",
      hint: "the name of the user",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Display name",
      name: "display_name",
      hint: "typically the full name of the user",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Password",
      name: "password",
      hint: "",
      options: [],
      type: "password",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
      minLength: 8
    },
    {
      label: "Confirm Password",
      name: "password_confirm",
      hint: "",
      options: [],
      type: "password",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
      minLength: 8,
      customValidation: {
        fieldsMatch: ["password"]
      }
    },
    {
      label: "Phone number",
      name: "phone",
      hint: "the phone number of the user. May be used for 2-factor authentication",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Email address",
      name: "email_address",
      hint: "the email address of the user. May be used for 2-factor authentication",
      options: [],
      type: "email",
      value: "",
      required: true
    },
    {
      label: "Picture",
      name: "picture",
      hint: "",
      options: [],
      type: "picture",
      value: "",
      required: false,
      assetType: "users",
    },
    {
      label: "Position",
      name: "position",
      hint: "The user's position in the institution",
      options: [],
      type: "text",
      value: "",
      required: false
    },
    {
      label: "Role",
      name: "role_name",
      hint: "",
      options: [],
      type: "api",
      value: "",
      required: true,
      api_url: "admin/roles",
      apiKeyProperty: "role_name",
      apiLabelProperty: "role_name",
      apiType: "select",
    },
    {
      label: "Deadline for two factor authentication",
      name: "two_fa_deadline",
      hint: "a date when the user will be required to use 2-factor authentication. If this is set and the user misses the date they will no longer be able to log in till the admin resets the 2-factor authentication",
      options: [],
      type: "date",
      value: "",
      required: true
    },

  ];
  fieldsTemplate: string = "TrainingInstitutionFormTemplate";
  id: string;
  constructor(ar: ActivatedRoute, private router: Router) {
    this.id = ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit user";
      this.existingUrl = `admin/users/${this.id}`;
      this.formUrl = `admin/users/${this.id}`;

      //if editing, the passwords should be optional
      this.fields.map(field => {
        if (field.name === "password") {
          field.required = false;
          field.hint = "Leave it blank if you don't intend to change this user's password. Else you can enter a new password"
        }
        if (field.name === "password_confirm") {
          field.required = false;
        }
      })
    }
  }

  ngOnInit(): void {
  }

  formSubmitted(args: boolean) {
    if (args) {
      this.router.navigate(['/admin/users'])
    }
  }


}
