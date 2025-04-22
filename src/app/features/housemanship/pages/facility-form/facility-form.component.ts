import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { HousemanshipService } from '../../housemanship.service';

@Component({
  selector: 'app-facility-form',
  templateUrl: './facility-form.component.html',
  styleUrls: ['./facility-form.component.scss']
})
export class FacilityFormComponent {
  title: string = "Add a new housemanship facility";
  formUrl: string = "housemanship/facilities/details";
  existingUrl: string = "housemanship/facilities/details";
  fields: IFormGenerator[] = [];
  id?: string = undefined;
  public loaded: boolean = false;
  extraFormData: { key: string; value: any; }[] = [];
  constructor(private ar: ActivatedRoute, private router: Router, private service: HousemanshipService) {

  }




  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit housemanship facility details";
      this.extraFormData = [{ key: "uuid", value: this.id }];
      this.existingUrl = `housemanship/facilities/details/${this.id}`;
      this.formUrl = `housemanship/facilities/details/${this.id}`;

    }
    this.getFormFields();
  }

  formSubmitted(args: boolean) {
    if (args) {
      this.router.navigate(['/housemanship/facilities']);
    }
  }

  getFormFields() {
    this.service.getFacilityFormConfig().subscribe(
      {
        next: data => {
          this.fields = data.data;
          this.loaded = true;
        },
        error: error => {
          console.error(error);
          this.fields = [];
          this.loaded = true;
        }
      }
    )
  }
}
