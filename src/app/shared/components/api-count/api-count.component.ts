import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { API_ACCOUNTS_PATH, API_ADMIN_PATH, API_CPD_PATH, API_DOCTOR_PATH, API_INTERN_PATH } from '../../utils/constants';

@Component({
  selector: 'app-api-count',
  templateUrl: './api-count.component.html',
  styleUrls: ['./api-count.component.scss']
})
export class ApiCountComponent implements OnInit {
  @Input() url: string = '';
  @Input() module: string = '';
  count: any = '...';
  loading: boolean = false;
  // the name of the property containing the data from the api
  @Input() property: string = 'count';
  //a type provided for use with the commonly used urls below
  @Input() type: string = '';
  constructor(private httpService: HttpService) {

  }

  ngOnInit(): void {
    this.getCount();
  }

  getCount(): void {
    this.loading = true;

    this.httpService.get<any>(this.url || this.commonUrls[this.type]).pipe(take(1)).subscribe(data => {
      this.loading = false;
      this.count = data[this.property]
    })
  }

  //list of common urls that can be reused by specifying the type
  commonUrls: { [key: string]: any } =
    {
      "doctorProvisionalRegistrationCount": `${API_INTERN_PATH}/getInternshipRegistrationsCount?type=Doctor`,
      "paProvisionalRegistrationCount": `${API_INTERN_PATH}/getInternshipRegistrationsCount?type=Physician Assistant`,
      "onlinePaymentsCount": `${API_ACCOUNTS_PATH}/getOnlinePaymentsCount`,
      "doctorRelicensureApprovalCount": `${API_ADMIN_PATH}/getPendingRelicensureCount?type=doctor&status=Pending Approval`,
      "doctorRelicensurePaymentCount": `${API_ADMIN_PATH}/getPendingRelicensureCount?type=doctor&status=Pending Payment`,
      "paRelicensureApprovalCount": `${API_ADMIN_PATH}/getPendingRelicensureCount?type=PA&status=Pending Approval`,
      "paRelicensurePaymentCount": `${API_ADMIN_PATH}/getPendingRelicensureCount?type=PA&status=Pending Payment`,
      "doctorPermanentRegistrationCount": `${API_INTERN_PATH}/getPermanentRegistrationsCount?type=Doctor`,
      "paPermanentRegistrationCount": `${API_INTERN_PATH}/getPermanentRegistrationsCount?type=Physician Assistant`,
      "doctorTemporaryRegistrationsCount": `${API_INTERN_PATH}/getTemporaryRegistrationsCount?type=Doctor`,
      "paTemporaryRegistrationCount": `${API_INTERN_PATH}/getTemporaryRegistrationsCount?type=Physician Assistant`,
      "doctorHousemanship1Count": `${API_INTERN_PATH}/getHousemanshipApplicationsCount?type=Doctor&session=1`,
      "paHousemanship1Count": `${API_INTERN_PATH}/getHousemanshipApplicationsCount?type=Physician Assistant&session=1`,
      "doctorHousemanship2Count": `${API_INTERN_PATH}/getHousemanship2ApplicationsCount?type=Doctor`,
      "portalCount": `${API_DOCTOR_PATH}/getNewDoctorEditsCount`,
      "doctorExamRegistrationCount": `${API_INTERN_PATH}/getExaminationRegistrationsCount?type=Doctor&status=Pending Approval`,
      "paExamRegistrationCount": `${API_INTERN_PATH}/getExaminationRegistrationsCount?type=Physician Assistant&status=Pending Approval`,
      "doctorsMedicalExamRegistrationCount": `${API_INTERN_PATH}/getExaminationRegistrationsCount?type=Doctor&status=Pending Approval&category=Medical`,
      "doctorsDentalExamRegistrationCount": `${API_INTERN_PATH}/getExaminationRegistrationsCount?type=Doctor&status=Pending Approval&category=Dental`,
      "paMedicalExamRegistrationCount": `${API_INTERN_PATH}/getExaminationRegistrationsCount?type=Physician Assistant&status=Pending Approval&category=Medical`,
      "paDentalExamRegistrationCount": `${API_INTERN_PATH}/getExaminationRegistrationsCount?type=Physician Assistant&status=Pending Approval&category=Dental`,
      "examSpecialistRegistrationCount": `${API_INTERN_PATH}/getExaminationSpecialistRegistrationsCount?type=Doctor&status=Pending Approval`,
      "examApplicationCount": `${API_INTERN_PATH}/getExaminationApplicationCount`,
      "cpdPending": `${API_CPD_PATH}/getTempCpdAttendeesCounts`,
    }



}
