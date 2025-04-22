import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { HousemanshipService } from '../../housemanship.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-posting-form',
  templateUrl: './posting-form.component.html',
  styleUrls: ['./posting-form.component.scss']
})
export class PostingFormComponent {

  title: string = "Add a new housemanship posting";
  formUrl: string = "housemanship/posting";
  existingUrl: string = "housemanship/posting/";
  fields: IFormGenerator[] = [];
  session: string = "1";
  public loaded: boolean = false;
  extraFormData: { key: string; value: any; }[] = [];
  destroy$: Subject<boolean> = new Subject();

  constructor(private ar: ActivatedRoute, private router: Router, private service: HousemanshipService) {

  }

  ngOnInit(): void {
    this.ar.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.session = params.get('session') || "1";
      this.getFormFields(this.session);
    })

  }

  formSubmitted(args: IFormGenerator[]) {
    const formData = args.reduce((acc: Record<string, any>, curr) => {
      //get the fields that are not posting_detail
      if (!curr.name.includes('posting_detail')) { acc[curr.name] = curr.value; }
      return acc;
    }, {});
    //get the posting_detail fields
    const postingDetails = args.filter((field) => field.name.includes('posting_detail'));
    //remove posting_detail from the name and put them in arrays based on the suffix number
    const detailsArray: Record<string, any>[] = [];
    postingDetails.forEach((field) => {
      const name = field.name.replace('posting_detail-', '');
      const [key, index] = name.split('-');
      field.name = key;
      const object: Record<string, any> = {};
      object[key] = field.value;
      if (!detailsArray[parseInt(index)]) {
        detailsArray[parseInt(index)] = {};
      }
      detailsArray[parseInt(index)][key] = field.value;
    });

    formData['details'] = detailsArray;
    formData['session'] = this.session;
    this.service.createPosting(formData).subscribe(
      {
        next: data => {
          this.router.navigate([`/housemanship/postings`]);
        },
        error: error => {
          console.error(error);
        }
      }
    )
  }

  getFormFields(session: string) {
    this.service.getPostingFormConfig(session).subscribe(
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
