import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-gtrid-transactions',
  templateUrl: './gtrid-transactions.component.html',
animations: [
    trigger('openClose', [
      state('open', style({
        display: 'block',
        opacity: 1,
      })),
      state('closed', style({
        display: 'none',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.4s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ],
  styleUrls: ['./gtrid-transactions.component.css']
})
export class GtridTransactionsComponent implements OnInit {
  public isOpen = true;
  constructor() { }

  ngOnInit() {
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
