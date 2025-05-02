import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { HousemanshipService } from '../../housemanship.service';
import { Subject, takeUntil } from 'rxjs';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { goBack } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-posting-application-form',
  templateUrl: './posting-application-form.component.html',
  styleUrls: ['./posting-application-form.component.scss']
})
export class PostingApplicationFormComponent {
  title: string = "Add a new housemanship posting application";
  formUrl: string = "housemanship/posting-application";
  existingUrl: string = "housemanship/posting-application/";
  fields: IFormGenerator[] = [];
  session: string = "1";
  public loaded: boolean = false;
  extraFormData: { key: string; value: any; }[] = [];//any extra data to be sent with the form that's not included in the form fields
  destroy$: Subject<boolean> = new Subject();
  id: string = "";
  constructor(private ar: ActivatedRoute, private router: Router, private service: HousemanshipService, private notify: NotifyService) {
    this.formUrl = `housemanship/posting-application`;
    this.existingUrl = `housemanship/posting-application/`;

  }

  ngOnInit(): void {
    this.ar.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.session = params.get('session') || "1";
      this.id = params.get('id') || "";
      if (this.id) {
        this.existingUrl = `housemanship/posting-application/${this.id}`;
        this.formUrl = `housemanship/posting-application/${this.id}`;
        this.extraFormData = [{ key: "uuid", value: this.id }]
        //in this case we get the session from the existing posting data. we wait for the form generator to load the existing data and then we get the session from the data
        this.loaded = true;
      }
      else {
        this.getFormFields(this.session);
      }

    })

  }

  existingDataLoaded(data: any) {
    this.session = data.session;
    this.getFormFields(data.session);
  }

  formSubmitted(args: IFormGenerator[]) {
    const formData = args.reduce((acc: Record<string, any>, curr) => {
      //get the fields that are not posting_detail
      if (!curr.name.includes('posting_application_detail')) { acc[curr.name] = curr.value; }
      return acc;
    }, {});
    //get the posting_detail fields
    const postingDetails = args.filter((field) => field.name.includes('posting_application_detail'));
    //remove posting_detail from the name and put them in arrays based on the suffix number
    const detailsArray: Record<string, any>[] = [];
    postingDetails.forEach((field) => {
      const name = field.name.replace('posting_application_detail-', '');
      const [key, index] = name.split('-');
      const object: Record<string, any> = {};
      object[key] = field.value;
      if (!detailsArray[parseInt(index)]) {
        detailsArray[parseInt(index)] = {};
      }
      detailsArray[parseInt(index)][key] = field.value;
    });

    formData['details'] = detailsArray;
    formData['session'] = this.session;
    const dbcall = this.id ? this.service.updatePostingApplication(formData, this.id) : this.service.createPostingApplication(formData);
    dbcall.subscribe(
      {
        next: data => {
          this.notify.successNotification(data.message);
          //if it was an edit, go back. else refresh the form
          if (this.id) {
            goBack();
          }
          else {
            this.getFormFields(this.session)
          }
        },
        error: error => {
          console.error(error);
        }
      }
    )
  }

  getFormFields(session: string) {
    this.service.getPostingApplicationFormConfig(session).subscribe(
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



  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
