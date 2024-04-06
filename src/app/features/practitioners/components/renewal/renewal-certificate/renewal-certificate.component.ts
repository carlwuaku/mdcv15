import { Component, OnInit } from '@angular/core';
import { RenewalObject } from '../renewal.model';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { PractitionerAdditionalQualification } from '../../additional-qualifications/additional_qualification_model';
import { getToday } from 'src/app/shared/utils/dates';

@Component({
  selector: 'app-renewal-certificate',
  templateUrl: './renewal-certificate.component.html',
  styleUrls: ['./renewal-certificate.component.scss']
})
export class RenewalCertificateComponent implements OnInit {
  object: RenewalObject | null = null;
  id:string;
  loading = false;
  qualifications: PractitionerAdditionalQualification[] = [];
  specialist_data: string = "";
  logo:string = "";
  constructor(private ar:ActivatedRoute, private dbService: HttpService) {
    this.id = ar.snapshot.params['id'];

   }
  ngOnInit(): void {
    this.getRenewal();
  }

  getRenewal(){
    this.loading = true
    this.dbService.get<{data: RenewalObject,
      qualifications: PractitionerAdditionalQualification[],
      specialist_data: string}>(`practitioners/renewal/${this.id}`).subscribe({
      next: response => {
        this.object = response.data;
        this.qualifications = response.qualifications;
        this.specialist_data = response.specialist_data;
        this.loading = false
      },
      error: error => {
        this.loading = false
      }
    })
  }

  print() {
    window.print();
  }

  getYear(date:string){
    return getToday("year", date);
  }
}
