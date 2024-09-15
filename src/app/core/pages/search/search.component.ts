import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  search_type: string = "Doctors";
  param: string = "";
  constructor(private ar: ActivatedRoute) {
    ar.queryParams
      .subscribe(params => {
        this.search_type = params['search_type'];
        this.param = params['param'];
      });
  }
}
