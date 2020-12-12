import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  getFilterMetaData(){
    return of({
      "Name": null,
      "Country":["IN","USA"],
      "City": ["Pune", "Mumbai", "Chennai","Delhi"],
      "Status": ["Draft", "In Progress","Completed","Cancelled"]
    });
  }
}
