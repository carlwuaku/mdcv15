import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { API_CPD_PATH } from 'src/app/shared/utils/constants';
import { CpdFacilityObject } from '../../models/cpd_facility_model';
@Component({
  selector: 'app-add-cpd-facility',
  templateUrl: './add-cpd-facility.component.html',
  styleUrls: ['./add-cpd-facility.component.scss']
})
export class AddCpdFacilityComponent {
  message: string = '';
  loading: boolean = false;
  name: string = '';
  id: string = '';
  location: string = '';
  phone: string = '';
  email: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddCpdFacilityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CpdFacilityObject,

    private dbService: HttpService,
    private notify: NotifyService) { 
    this.name = data.name;
    this.id = data.id;
    this.location = data.location;
    this.phone = data.phone;
    this.email = data.email;
    }

  ngOnInit() {
  }

  submit() {

    this.notify.showLoading();
    let data = new FormData();

    data.append("name", this.name);
    data.append("location", this.location);
    data.append("email", this.email);
    data.append("phone", this.phone);
    if(this.id) data.append("id", this.id);
    this.dbService.post<any>(`${API_CPD_PATH}/addCpdFacility`, data)
      .pipe(take(1)).subscribe({
        next:(data:any) => {
          //the id of the new bank is saved int he status
          const facility: CpdFacilityObject = {
            name: this.name,
            location: this.location,
            phone: this.phone,
            email: this.email,
            id: data.data,
            number_organized: 0
          };
          
          this.notify.successNotification("facility: " + this.name + " saved successfully");
          this.dialogRef.close(facility);


      }, error: () => {
        this.notify.noConnectionNotification();
        // console.log(error);

        },
        complete: () => {
          this.notify.hideLoading();

      }});
  }

  closeDialog(): void{
    this.dialogRef.close();
  }

}
