import { Component, OnInit } from '@angular/core';
import { DeliveryPathFacade } from '../../state/delivery-path.facade';
import { HireTrackerResponse } from '../../models/hire-tracker-response.model';
import { Observable } from 'rxjs';
import { RemoteData } from 'ngx-remotedata';
import { ITimeline } from 'src/app/features/delivery-path/components/timeline/timeline.model';

@Component({
  selector: 'app-tracking-history',
  templateUrl: './tracking-history.component.html',
  styleUrls: ['./tracking-history.component.scss']
})
export class TrackingHistoryComponent implements OnInit {
  list: ITimeline[] = [];
  getApiResponse$: Observable<RemoteData<HireTrackerResponse, Error>> = this.deliveryFacade.getDeliveryPathDataApiResponse$;
  defaultMessage: string = "";

  constructor(private deliveryFacade: DeliveryPathFacade) { }

  ngOnInit(): void {
    this.deliveryFacade.getDeliveryPathDataApiResponse$.subscribe(data => {
      if (data.tag === "Success") {
        if (data.value.trackingHistory.length !== 0) {
          this.list = [];
          //since the data is a list of objects with timestamps,
          //sort and group the data into dates
          let hashMap: { [key: string]: any[] } = {};
          data.value.trackingHistory.forEach(item => {
            let timestamp = item.timestamp;
            if (typeof (item.timestamp) === "string") {
              timestamp = new Date(item.timestamp)
            }
            const date = timestamp.toLocaleString([], { month: 'long', day: 'numeric', year: 'numeric' });
            const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            if (!hashMap[date]) {
              hashMap[date] = [{ time: time, event: item.note }]
            }
            else {
              hashMap[date].push({ time: time, event: item.note })
            }
          })
          Object.keys(hashMap).forEach(key => {
            this.list.push({ date: key, events: hashMap[key] });
          })
        }
        else if (data.value.trackingHistory.length === 0) {
           this.defaultMessage = "No tracking data is available";
        }
      }
    })
  }
}
