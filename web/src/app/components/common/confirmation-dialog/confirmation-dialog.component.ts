import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDialogComponent } from "../modal-dialog/modal-dialog.component";
import { faBorderNone, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [ModalDialogComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements OnInit, AfterViewInit {
  @ViewChild("confirmation_dialog") confirmation_dialog!: ModalDialogComponent;
  @Input() modalTitle: string = "Confirm";
  @Input() modalText: string = "Are you sure?";
  @Input() btnYesText: string = "Yes";
  @Input() btnNoText: string = "No";
  @Input() btnYesIcon: IconDefinition = faBorderNone;
  @Input() btnYesClass: string = "";
  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {
    
  }

  ngOnInit(){
    
  }

  ngAfterViewInit() {
    this.confirmation_dialog.modalTitle = this.modalTitle;
    this.confirmation_dialog.btnSaveText = this.btnYesText;
    this.confirmation_dialog.btnCancelText = this.btnNoText;
    this.confirmation_dialog.btnSaveIcon = this.btnYesIcon;
    this.confirmation_dialog.btnSaveClass = this.btnYesClass;

    this.confirmation_dialog.confirm.subscribe((value: Boolean) => {
      this.confirm.emit(value);
    });    
  }
  
  public open() {
    this.confirmation_dialog.open();
  }
}
