import { Component, Input } from '@angular/core';
import { take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';

@Component({
  selector: 'api-count',
  templateUrl: './api-count.component.html',
  styleUrls: ['./api-count.component.scss']
})
export class ApiCountComponent {
  @Input() url: string = '';
  @Input() module: string = '';
  count: any = '...';
  loading: boolean = false;
  // the name of the property containing the data from the api
  @Input() property: string = 'count'
  constructor(private httpService: HttpService) {
    
  }

  getCount(): void {
    console.log('calling getcount')
    this.loading = true;
    this.httpService.get<any>(this.url).pipe(take(1)).subscribe(data => {
      this.loading = false;
      this.count = data[this.property]
    })
  }
}
