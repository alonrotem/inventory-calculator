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

  /*
  Usage from within a component:

  // OPTION 1: Waiting for the promise to resulve with .then(...)
  this.confirm_action.open_with_message({
    modalText: "Are you sureyou want to perform this action?",
    modalTitle: "Confirm please"
    }).then((confirmed) => {
      // user confirmed! Your code here
  });
  //(user cancelled is just ignored)

  // OPTION 2: Using async/await
  const confirmed = await this.confirm_action.open_with_message({
    modalText: "Are you sureyou want to perform this action?",
  });
  if (confirmed) {
    // user confirmed! Your code here
  }
  //(user cancelled is just ignored)
  */
  public open_with_message(options: {
    modalText?: string;
    modalTitle?: string;
    btnYesText?: string;
    btnNoText?: string;
    btnYesIcon?: IconDefinition;
    btnSaveIcoMoonIcon?: string;
    btnYesClass?: string;
    btnNoClass?: string;
    dialogIcon?: IconDefinition | null;
    dialogIconClass?: string;
    reverseButtons?: boolean;
  }): Promise<boolean> {
    if (options.modalTitle !== undefined) this.confirmation_dialog.modalTitle = options.modalTitle;
    if (options.modalText !== undefined) this.modalText = options.modalText;
    if (options.btnYesText !== undefined) this.confirmation_dialog.btnSaveText = options.btnYesText;
    if (options.btnNoText !== undefined) this.confirmation_dialog.btnCancelText = options.btnNoText;
    if (options.btnYesIcon !== undefined) this.confirmation_dialog.btnSaveIcon = options.btnYesIcon;
    if (options.btnSaveIcoMoonIcon !== undefined) this.confirmation_dialog.btnSaveIcoMoonIcon = options.btnSaveIcoMoonIcon;
    if (options.btnYesClass !== undefined) this.confirmation_dialog.btnSaveClass = options.btnYesClass;
    if (options.btnNoClass !== undefined) this.confirmation_dialog.btnCancelClass = options.btnNoClass;
    if (options.dialogIcon !== undefined) this.dialogIcon = options.dialogIcon;
    if (options.dialogIconClass !== undefined) this.dialogIconClass = options.dialogIconClass;
    if (options.reverseButtons !== undefined) this.reverseButtons = options.reverseButtons;

    this.confirmation_dialog.open();
    this.isOpen = true;

    return new Promise<boolean>((resolve) => {
      const confirmSub = this.confirmation_dialog.confirm.subscribe((value: boolean) => {
        resolve(!!value);
        confirmSub.unsubscribe();
        cancelSub.unsubscribe();
        this.isOpen = false;
      });
      const cancelSub = this.cancel.subscribe(() => {
        resolve(false);
        confirmSub.unsubscribe();
        cancelSub.unsubscribe();
        this.isOpen = false;
      });
    });
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
