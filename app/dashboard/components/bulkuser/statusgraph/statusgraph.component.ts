import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-statusgraph',
  templateUrl: './statusgraph.component.html',
  styleUrls: ['./statusgraph.component.css']
})
export class StatusgraphComponent {
  statusdata: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.statusdata = data.item;
     
  }

  ngOnInit() {
  }

}
