import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selected-filters',
  templateUrl: './selected-filters.component.html',
  styleUrls: ['./selected-filters.component.scss']
})
export class SelectedFiltersComponent implements OnInit {

  filterKeys:string[];
  filterObj: object;

  @Input("filters")
  set filtersData(filters){
    if(filters && filters!=null){
      this.filterKeys = Object.keys(filters);
      this.filterObj = filters;
    }else{
      this.filterKeys=[];
      this.filterObj=null;
    }
  }

  @Output("removeFilter")
  removeFilter: EventEmitter<string> = new EventEmitter();

  @Output("removeFilterValue")
  removeFilterValue: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  remove(key){
    this.removeFilter.emit(key);
  }

  removeFilterItemValue(event){
    this.removeFilterValue.emit(event);
  }
}
