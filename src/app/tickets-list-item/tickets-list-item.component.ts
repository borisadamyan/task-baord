import {Component, Input, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';

@Component({
  selector: 'tickets-list-item',
  templateUrl: './tickets-list-item.component.html',
  styleUrls: ['./tickets-list-item.component.scss']
})
export class TicketsListItemComponent implements OnInit {

  @Input() ticket;
  @Input() index;
  group;

  constructor(private sharedService: SharedService) {
  }

  ngOnInit() {
    this.group = this.sharedService.selectedGroup;
  }

  prev(ticket) {
    console.log(ticket);
    this.sharedService.ticketMove.emit({action: 'prev', ticket});
  }

  next(ticket) {
    // console.log(ticket);
    // ticket.status.title = 'In Progress';
    this.sharedService.ticketMove.emit({action: 'next', ticket});
  }

}
