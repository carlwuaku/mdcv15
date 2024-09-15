import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent {
  types: string[] = ["Licenses", "Applications", "CPD", "Examinations",
    "Examination Candidates"];
  @Input() param: string = "";
  @Input() search_type: string = "Doctors";

  constructor(private router: Router, private ar: ActivatedRoute
  ) {
    ar.queryParams
      .subscribe(params => {
        //console.log(params);

        this.search_type = params['search_type'];
        this.param = params['param'];
      });
  }



  submit() {

    this.router.navigate(['/search'], {
      queryParams:
        { param: this.param, search_type: this.search_type, t: Date.now() }
    });


  }
}
