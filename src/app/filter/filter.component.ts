import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as _ from 'underscore';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit{

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Input("metadata")
  metadata: object;

  @Output("selectedFilters")
  selectedFilters:EventEmitter<any> = new EventEmitter();

  @ViewChild("trigger") 
  trigger: MatAutocompleteTrigger;

  @ViewChild("inp")
  inp: ElementRef;

  filterSelected: string[]=[];
  filterCriteria: object = {};
  textFilter: any;
  filterOptions:string[] = [];
  isCriteriaExists=false;

  constructor(){}

  ngOnInit(): void {
    this.filterSelected=[];
    this.createMainFilterOptions();
  }

  // Default Main filter
  createMainFilterOptions(){
    this.filterOptions = ((this.metadata && this.metadata!=null)?Object.keys(this.metadata):[]);
  }

  // To remove filter selected
  removeFilter(): void {
    let size = this.filterSelected.length;
    if(size==2){
      this.filterSelected.pop();
      this.populateOptionBasedOnSelection(this.filterSelected[0]);
    }else{
      this.filterSelected =[];
      this.createMainFilterOptions();
    }
  }

  //called when an option is selected
  optionSelected(event){
    // do not allow if there are more than 2 filter - key and value
    if(this.filterSelected && this.filterSelected!=null && this.filterSelected.length == 2){
      return;
    }

    // get the option selected
    const option = event.option.viewValue;

    // if filter is an array
    if (this.filterSelected && this.filterSelected!=null){
      //if its the first element - key - being selected
      if(this.filterSelected.length==0){
        this.filterSelected.push(option);
        this.populateOptionBasedOnSelection(option);
        this.resetTextFilter();
      }
      // if its the second element - value - being selected
      else if(this.filterSelected.length==1 && this.filterSelected[0] != option){
        this.filterSelected.push(option);
        this.filterOptions = [];
        this.resetTextFilter();
      }
    }else{
      this.createMainFilterOptions();
    }
  }

  // get options based on key selected
  populateOptionBasedOnSelection(option){
    let nestedOption = this.metadata[option];

    // if there exists nested options then display else empty display options
    if(nestedOption && nestedOption!=null && nestedOption.length>0){
      setTimeout(()=>{
        let existingCriteriaValue =this.filterCriteria[option];
        if(existingCriteriaValue){
          if(typeof existingCriteriaValue == "string"){
            nestedOption = _.difference(nestedOption, [this.filterCriteria[option]]);
          }else{
            nestedOption = _.difference(nestedOption, this.filterCriteria[option] );
          }
        }
        this.filterOptions = nestedOption;
        this.trigger.openPanel();
      });
    }else{
      this.filterOptions = [];
    }
  }

  // compiling the complete filter criteria
  addToSelectedFilter(){
    if (!(this.filterCriteria && this.filterCriteria!=null)){
      this.filterCriteria={}
    }

    const key = this.filterSelected[0];
    const value = this.filterSelected[1];

    let criteriaKeyValue = this.filterCriteria[key];

    if(criteriaKeyValue && criteriaKeyValue!=null){
      if(Array.isArray(criteriaKeyValue)){
        this.filterCriteria[key].push(value)
      }else if (typeof criteriaKeyValue == "string"){
        this.filterCriteria[key]=[criteriaKeyValue, value];
      }
    }else{
      this.filterCriteria[key]=value;
    }

    this.filterCriteria = Object.assign({},this.filterCriteria);
    if(Object.keys(this.filterCriteria).length>0){
      this.isCriteriaExists = true;
    }else{
      this.isCriteriaExists = false;
    }
    this.selectedFilters.emit(this.filterCriteria);
  }

  // reset all filter related variables
  resetFilter(){
    setTimeout(()=>{
      this.resetTextFilter();
      this.filterSelected=[];
      this.createMainFilterOptions();
      this.trigger.closePanel();
    });
  }

  // reset the input box text
  resetTextFilter(){
    this.textFilter=null;
    this.inp.nativeElement.value=null;
  }

  // filtering logic based on user entered text
  filterOptionsBasedOnText(){
    let searchText = this.inp.nativeElement.value;
    let allOptions = [];
    if(this.filterSelected.length == 1 && this.metadata[this.filterSelected[0]]){
      let key = this.filterSelected[0];
      allOptions = [...this.metadata[key]];
      if(this.filterCriteria[key]){
        allOptions = _.difference(allOptions, this.filterCriteria[key]);
      }
    }else if (this.filterSelected.length == 0){
      allOptions = Object.keys(this.metadata);
    }
    if(searchText && searchText!=null && searchText.trim().length>0){
        this.filterOptions = _.filter(allOptions, e=> e.toLowerCase().indexOf(searchText.toLowerCase()) != -1);
      }else{
        this.filterOptions = allOptions;
      }
  }

  // key up events
  // when on filter information is filled dont allow user to type
  keyPress(event){
    // when on filter information is filled dont allow user to type except enter
    if (this.filterSelected && this.filterSelected!=null && this.filterSelected.length <=2){

      // if ENTER or TAB is pressed
      if(event.keyCode == 13 || event.keyCode == 9){

        if(this.filterSelected.length == 2){
          this.addToSelectedFilter();
          this.resetFilter();
        }else if (this.filterSelected.length == 1 && this.textFilter && this.textFilter !=null && this.textFilter.trim().length>0){
          this.filterSelected.push(this.textFilter);
          this.addToSelectedFilter();
          this.resetFilter();
        }
      }else if (this.filterSelected.length < 2){
        this.filterOptionsBasedOnText();
      }else{
        event.preventDefault();
      }
    }
    else{
      event.preventDefault();
    }
  }

  //remove key from filter criteria
  removeFilterCriteria(key){
    this.filterCriteria = _.omit(this.filterCriteria, key);
    this.selectedFilters.emit(this.filterCriteria);

  }

  removeFilterCriteriaValue(obj){
    const {key, val} = obj;
    let fc = Object.assign({},this.filterCriteria);
    fc[key] = _.without(fc[key],val);
    this.filterCriteria = fc;
    if((fc[key]).length == 0){
      this.removeFilterCriteria(key);
    }
    this.selectedFilters.emit(this.filterCriteria);
  }

  clearAllFilter(){
    this.filterCriteria={};
    this.selectedFilters.emit({});
    this.resetFilter();
    this.resetTextFilter();
  }
}

