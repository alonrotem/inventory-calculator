import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDialogComponent } from "../modal-dialog/modal-dialog.component";
import { faBorderNone, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [ModalDialogComponent, NgIf, FaIconComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements OnInit, AfterViewInit {
  @ViewChild("confirmation_dialog") confirmation_dialog!: ModalDialogComponent;
  @Input() modalTitle: string = "Confirm";
  @Input() modalText: string = "Are you absolutely sure?";
  @Input() btnYesText: string = "Yes";
  @Input() btnNoText: string = "No";
  @Input() btnYesIcon: IconDefinition = faBorderNone;
  @Input() btnYesClass: string = "";
  @Input() btnNoClass: string = "";
  @Input() dialogIcon: IconDefinition | null = null;
  @Input() dialogIconClass: string = "text-warning";
  @Input() reverseButtons: boolean = false;
  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  isOpen : boolean = false;

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
    this.confirmation_dialog.btnCancelClass = this.btnNoClass;

    this.confirmation_dialog.confirm.subscribe((value: Boolean) => {
      this.confirm.emit(value);
      this.isOpen = false;
    });    
  }
  
  public open() {
    this.confirmation_dialog.open();
    this.isOpen = true;
  }

    @HostListener('document:keyup.escape', ['$event']) onEscdownHandler(evt: KeyboardEvent) {
      if(this.isOpen) {
        evt.preventDefault();
        //console.log("ESC Caught");
        this.cancel.emit();
        this.isOpen = false;
      }
    }
  
    @HostListener('document:keyup.enter', ['$event']) onEnterdownHandler(evt: KeyboardEvent) {
      if(this.isOpen) {
        evt.preventDefault();
        //console.log("Enter Caught");
        this.confirm.emit();
        this.isOpen = false;
      }
    }
}
