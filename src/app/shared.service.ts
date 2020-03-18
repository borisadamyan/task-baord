import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private currentGrouping = 'status.id';
  private currentSorting = 'priority.id';
  ticketMove = new EventEmitter();


  constructor() {
  }

  set selectedGroup(v) {
    console.log(v);
    this.currentGrouping = v;
  }

  get selectedGroup() {
    return this.currentGrouping;
  }

  set selectedSort(v) {
    console.log(v);
    this.currentSorting = v;
  }

  get selectedSort() {
    return this.currentSorting;
  }
}
