import { Component } from '@angular/core';
import { FilterService } from './filter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  filterMetadata: object = null;
  criteria: null;

  constructor(private filterService: FilterService){
    this.filterService.getFilterMetaData().subscribe(data => {
      this.filterMetadata = data;
    })
  }

  filterCriteria(criteria){
    this.criteria = criteria;
  }
}
