import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';

@Component({
    selector: 'app-role-form',
    templateUrl: './role-form.component.html',
    styleUrls: ['./role-form.component.scss'],
    standalone: false
})
export class RoleFormComponent {
  title: string = "Add a new role";
  formUrl: string = "admin/roles";
  existingUrl: string = "admin/roles";
  fields: IFormGenerator[] = [
    {
      label: "Role name",
      name: "role_name",
      hint: "the name of the role",
      options: [],
      type: "text",
      value: "",
      required: true
    },
    {
      label: "Description",
      name: "description",
      hint: "",
      options: [],
      type: "textarea",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    }
  ];
  id: string;
  constructor(ar: ActivatedRoute, private router:Router) {
    this.id = ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit role";
      this.existingUrl = `admin/roles/${this.id}`;
      this.formUrl = `admin/roles/${this.id}`;

    }
  }

  ngOnInit(): void {
  }

  formSubmitted(args:boolean) {
    if (args) {
      this.router.navigate(['/admin/roles'])
    }
  }
}
