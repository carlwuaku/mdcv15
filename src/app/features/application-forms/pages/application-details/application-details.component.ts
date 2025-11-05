import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationFormService } from '../../application-form.service';
import { take } from 'rxjs';
import { ApplicationFormObject } from '../../models/application-form.model';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})
export class ApplicationDetailsComponent implements OnInit {
  id: string;
  data: ApplicationFormObject | null = null;
  loading = false;
  error: string | null = null;
  constructor(private ar: ActivatedRoute, private applicationService: ApplicationFormService) {
    this.id = ar.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.loadData();
  }


  loadData = () => {
    return this.applicationService.getApplicationDetails(this.id)
  }
}

