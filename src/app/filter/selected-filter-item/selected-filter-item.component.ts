import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selected-filter-item',
  templateUrl: './selected-filter-item.component.html',
  styleUrls: ['./selected-filter-item.component.scss']
})
export class SelectedFilterItemComponent implements OnInit {

  val:any;
  valType: string;

  @Input("key")
  key: string;

  @Input("value")
  set setVal(val){
    this.val = val;
    this.valType = typeof val;
  }

  @Output("removeFilterItemValue")
  removeFilterItemValue: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  removeFilterValue(key, val){
    this.removeFilterItemValue.emit({key,val});
  }
}
