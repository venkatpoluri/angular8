import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialogue-box',
  templateUrl: './confirm-dialogue-box.component.html',
  styleUrls: ['./confirm-dialogue-box.component.css']
})
export class ConfirmDialogueBoxComponent {


  settings: any = { message: 'Are you sure?', confirmText: 'Yes', cancelText: 'No' };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.message)
      this.settings.message = data.message;
    if (data && data.confirmText)
      this.settings.confirmText = data.confirmText;
    if (data && data.cancelText)
      this.settings.cancelText = data.cancelText;
  }

  ngOnInit() {
  }

}
