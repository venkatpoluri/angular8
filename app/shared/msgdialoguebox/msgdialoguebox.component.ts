import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-msgdialoguebox',
  templateUrl: './msgdialoguebox.component.html',
  styleUrls: ['./msgdialoguebox.component.css']
})
export class MsgdialogueboxComponent {
  constructor(public dialog: MatDialog, private dialogRef: MatDialogRef<MsgdialogueboxComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }
}
