import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { DateService } from 'src/app/core/date/date.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-select-object',
    templateUrl: './select-object.component.html',
    styleUrls: ['./select-object.component.scss'],
    standalone: false
})
export class SelectObjectComponent implements OnInit, OnChanges {
  @Input() url: string = "";
  @Input() labelProperty: string = "name";
  @Input() keyProperty: string = "id";
  @Input() initialValue: string = "";
  @Input() type: "search" | "select" | "datalist" = "select";
  isLoaded: boolean = false;
  loading: boolean = false;
  error: boolean = false;
  error_message: string = "";
  objects: any[] = []
  selectedItem: string = ""
  @Input() timestamp: string = ""
  @Output() selectionChanged = new EventEmitter();

  @Input() selection_mode: "single" | "singles" | "multiple" = "single";
  search_param: string = "";
  dataListId: string = "";
  @Input() fieldLabel: string = "";
  @Input() embedSearchResults: boolean = false;
  searchRan: boolean = false;
  selectedSearchItems: any[] = [];
  constructor(private dbService: HttpService, private dateService: DateService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.type === "datalist" && !this.dataListId.trim()) {
      this.dataListId = uuidv4();
    }
    if (((changes['url']?.currentValue !== changes['url']?.previousValue)
      || (changes['type']?.currentValue !== changes['type']?.previousValue))
      && (this.type === "datalist" || this.type === "select")) {
      console.log(this.type)
      this.getData();
    }
  }
  ngOnInit(): void {
    // this.getData()
  }



  getData() {
    this.loading = true;

    this.dbService.get<any>(this.url).pipe(take(1))
      .subscribe({
        next: (data: any) => {
          //console.log(data.records);
          //in some rare cases the data is returned as the result, not in the data prop
          this.objects = data.data || data;
          if (this.initialValue) {
            this.selectedItem = this.initialValue
          }
          this.isLoaded = true;
          this.error = false;

        },
        error: (err) => {
          this.error = true;
          this.isLoaded = false;
          this.error_message = err;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  selectionMade() {
    this.selectionChanged.emit(this.selectedItem);
  }


  search() {
    this.loading = true;
    this.searchRan = false;
    const searchUrl = this.url + `?param=${this.search_param}`;
    this.dbService.get<any>(searchUrl).pipe(take(1))
      .subscribe({
        next: (data: any) => {
          //in some rare cases the data is returned as the result, not in the data prop
          this.objects = data.data || data;
          if (this.initialValue) {
            this.selectedItem = this.initialValue
          }
          if (this.objects.length === 1) {
            this.selectionChanged.emit(this.objects[0])
          }
          this.isLoaded = true;
          this.error = false;
          this.searchRan = true;
        },
        error: (err) => {
          this.error = true;
          this.isLoaded = false;
          this.error_message = err;
          this.searchRan = true;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  saveSearchSelection() {
    this.selectionChanged.emit(this.selectedSearchItems);
    this.objects = [];
    this.search_param = "";
  }
}


