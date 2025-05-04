import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponent } from 'src/app/shared/components/form-generator/form-generator.component';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';


@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {
  title: string = "Send Email";
  existingData: Record<string, any> = {};
  constructor() {

  }

  extraFormData?: { key: string; value: any; }[] | undefined;


  ngOnInit(): void {
    //get the data from the route
    const data: Record<string, any> = history.state.data;


  }

  formSubmitted(args: boolean) {
    if (args) {
    }
  }
}
