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
  fields: IFormGenerator[] = [
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
      name: "email",
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
      required: false
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
