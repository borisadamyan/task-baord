import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import * as _ from 'lodash';
import {interval, Subject} from 'rxjs';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  ticketsList;
  isAsc = false;
  filteredTickets = [];
  groupedTickets = [];
  defaultSort = 0;
  defaultGroup = 0;
  selectedSort = null;
  selectedGroup = null;
  sortCategory = [
    {
      id: 0,
      title: 'Priority'
    },
    {
      id: 1,
      title: 'Assignee'
    },
    {
      id: 2,
      title: 'Name'
    }
  ];
  groupCategory = [
    {
      id: 0,
      title: 'Status'
    },
    {
      id: 1,
      title: 'Assignee'
    },
    {
      id: 2,
      title: 'Priority'
    }
  ];
  groupStatuses = ['To Do', 'Research', 'In Progress', 'Done', 'Review'];
  searchText = new Subject();

  constructor(private api: ApiService, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.getTickets();
    this.startIntervalForGettingTickets();
    this.moveDetection();
  }

  startIntervalForGettingTickets() {
    const time = interval(15000);
    time.subscribe(t => {
      this.updateTickets();
    });
  }

  moveDetection() {
    this.sharedService.ticketMove.subscribe(e => {
      console.log(e);
      // console.log(this.ticketsList);
      this.ticketsList.map(t => {
        if (t.id === e.ticket.id) {
          // console.log(t);
          const id = e.ticket.status.id;
          if (e.action === 'next') {
            t.status = {
              id: id !== 4 ? id + 1 : id,
              title: this.groupStatuses[id !== 4 ? id + 1 : id]
            };
            console.log(this.groupedTickets);
            this.keepState();
          } else {
            t.status = {
              id: id !== 0 ? id - 1 : id,
              title: this.groupStatuses[id !== 0 ? id - 1 : id]
            };
            this.keepState();
          }
        }
      });
      // console.log(this.ticketsList);
    });
  }

  updateTickets() {
    this.api.getTickects()
      .subscribe(tickets => {
        const ticketsList = tickets;
        console.log('New', ticketsList);
        console.log('OLD', this.ticketsList);
        this.ticketsList.map((t, i) => {
          // console.log(ticketsList[i].title);
          t.title = ticketsList[i].title;
        });
        this.keepState();
        this.sortTickets();
      });
  }

  getTickets() {
    this.api.getTickects()
      .subscribe(tickets => {
        this.ticketsList = tickets;
        this.keepState();
      });
  }

  keepState() {
    this.selectedGroup = this.sharedService.selectedGroup;
    this.selectedSort = this.sharedService.selectedSort;
    this.groupedTickets = Object.entries(this.grouping(this.ticketsList, this.selectedGroup));
    this.groupedTickets.map(g => {
      g[1] = this.sorting(g[1], this.selectedSort);
    });
    // console.log(this.groupedTickets);
  }

  onSortSelected(sort) {
    console.log(sort);
    if (sort.title === 'Priority') {
      this.groupedTickets.map(g => {
        g[1] = this.sorting(g[1], 'priority.id');
        this.sharedService.selectedSort = 'priority.id';
      });
    } else if (sort.title === 'Assignee') {
      this.groupedTickets.map(g => {
        g[1] = this.sorting(g[1], 'assignee.name');
        this.sharedService.selectedSort = 'assignee.name';
      });
    } else if (sort.title === 'Name') {
      this.groupedTickets.map(g => {
        g[1] = this.sorting(g[1], 'title');
        this.sharedService.selectedSort = 'title';
      });
    }
    console.log('Selected Sort', this.selectedSort);
    // this.groupedTickets = Object.entries(this.groupedTickets);
    // console.log(this.groupedTickets);
    // this.groupedTickets.map(g => {
    //   g[1] = this.sorting(g[1], 'title');
    // });
    console.log(this.groupedTickets);
  }

  onGroupSelected(group) {
    this.groupedTickets = [];
    if (group.title === 'Status') {
      this.groupedTickets = this.grouping(this.ticketsList, 'status.id');
      this.sharedService.selectedGroup = 'status.id';
    } else if (group.title === 'Assignee') {
      this.groupedTickets = this.grouping(this.ticketsList, 'assignee.name');
      this.sharedService.selectedGroup = 'assignee.name';
    } else if (group.title === 'Priority') {
      this.groupedTickets = this.grouping(this.ticketsList, 'priority.title');
      this.sharedService.selectedGroup = 'priority.title';
    }
    this.groupedTickets = Object.entries(this.groupedTickets);
    console.log(this.groupedTickets);
  }

  grouping(obj, groupField) {
    return _.groupBy(obj, groupField);
  }

  sorting(obj, sortField) {
    return _.sortBy(obj, sortField);
  }

  onClickSortButton() {
    this.isAsc = !this.isAsc;
    this.sortTickets();
  }

  sortTickets() {
    // console.log(this.groupedTickets);
    this.groupedTickets.map(g => {
      // console.log(g[1]);
      if (!this.isAsc) {
        // console.log(this.selectedSort);
        if (this.selectedSort === 'priority.id') {
          g[1].sort((a, b) => {
            return (a.priority.id - b.priority.id);
          });
        } else if (this.selectedSort === 'assignee.name') {
          g[1].sort((a, b) => {
            const x = a.assignee.name.toLowerCase();
            const y = b.assignee.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          });
        } else if (this.selectedSort === 'title') {
          g[1].sort((a, b) => {
            const x = a.title.toLowerCase();
            const y = b.title.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          });
        }
      } else {
        if (this.selectedSort === 'priority.id') {
          g[1].sort((a, b) => {
            return (b.priority.id - a.priority.id);
          });
        } else if (this.selectedSort === 'assignee.name') {
          g[1].sort((a, b) => {
            const x = a.assignee.name.toLowerCase();
            const y = b.assignee.name.toLowerCase();
            return x > y ? -1 : x < y ? 1 : 0;
          });
        } else if (this.selectedSort === 'title') {
          g[1].sort((a, b) => {
            const x = a.title.toLowerCase();
            const y = b.title.toLowerCase();
            return x > y ? -1 : x < y ? 1 : 0;
          });
        }
      }
    });
    // console.log(this.groupedTickets);
  }

  filtering(e) {
    this.searchText.next(e.target.value);
  }

}
