import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})
export class TicketsListComponent implements OnInit {
  @Input() list;
  @Input() groupStatuses;
  filteredList;
  title;
  @Input() searchText: Observable<any>;

  constructor() {
  }

  ngOnInit() {
    this.title = this.checkListTitle();
    this.filteredList = [...this.list];
    this.searchText.subscribe(e => {
      const filterValue = e.toLowerCase();
      this.list[1] = this.filteredList[1].filter(v => {
        return v.title.toLowerCase().includes(filterValue) || v.description.toLowerCase().includes(filterValue);
      });
    });
  }

  checkListTitle() {
    return !isNaN(this.list[0]) ? this.groupStatuses[this.list[0]] : this.list[0];
  }

}
