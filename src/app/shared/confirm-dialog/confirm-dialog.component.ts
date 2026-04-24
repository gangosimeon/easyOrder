import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }  from '@angular/material/icon';

export interface ConfirmDialogData {
  title:         string;
  message:       string;
  confirmLabel?: string;
  icon?:         string;
  color?:        string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls:  ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  confirm(): void { this.dialogRef.close(true); }
  cancel():  void { this.dialogRef.close(false); }
}
