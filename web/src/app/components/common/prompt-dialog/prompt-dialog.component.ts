import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DialogClosingReason, ModalDialogComponent } from "../modal-dialog/modal-dialog.component";
import { faBorderNone, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ModalContentDirective } from '../directives/modal-content.directive';

@Component({
  selector: 'app-prompt-dialog',
  standalone: true,
  imports: [ModalDialogComponent, NgIf, FaIconComponent, FormsModule, ModalContentDirective],
  templateUrl: './prompt-dialog.component.html',
  styleUrl: './prompt-dialog.component.scss'
})
export class PromptDialogComponent implements OnInit, AfterViewInit, ModalContentDirective {
  @ViewChild("prompt_dialog") prompt_dialog!: ModalDialogComponent;
  @Input() modalTitle: string = "Confirm";
  @Input() modalText: string = "Are you absolutely sure?";
  @Input() modalValue: string = "";
  @Input() btnYesText: string = "Yes";
  @Input() btnNoText: string = "No";
  @Input() btnYesIcon: IconDefinition = faBorderNone;
  @Input() btnYesClass: string = "";
  @Input() btnNoClass: string = "";
  @Input() dialogIcon: IconDefinition | null = null;
  @Input() reverseButtons: boolean = false;
  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild("txt_prompt", { read: ElementRef }) txt_prompt!: ElementRef;
  isOpen : boolean = false;

  constructor() {
    
  }
  @ViewChild("prompt_dialog") dialogWrapper!: ModalDialogComponent;

  editedObject: any;
  onOpen(): void {
    throw new Error('Method not implemented.');
  }
  beforeClose(reason: DialogClosingReason): Boolean {
    throw new Error('Method not implemented.');
  }
  close: EventEmitter<any> = new EventEmitter<string>();

  ngOnInit(){
    
  }

  ngAfterViewInit() {

    this.prompt_dialog.confirm.subscribe((value: Boolean) => {
      this.confirm.emit(this.modalValue);
      this.isOpen = false;
    });    
  }
  
  public open() {
    this.prompt_dialog.modalTitle = this.modalTitle;
    this.prompt_dialog.btnSaveText = this.btnYesText;
    this.prompt_dialog.btnCancelText = this.btnNoText;
    this.prompt_dialog.btnSaveIcon = this.btnYesIcon;
    this.prompt_dialog.btnSaveClass = this.btnYesClass;
    this.prompt_dialog.btnCancelClass = this.btnNoClass;

    this.prompt_dialog.open();
    this.isOpen = true;
    this.txt_prompt.nativeElement.focus();
  }
}