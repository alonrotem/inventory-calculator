import { Component, ViewChild, HostListener, ElementRef, Output, Input, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage, ImageTransform } from 'ngx-image-cropper';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { faBan, faCrop, faMagnifyingGlassMinus, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';

//import { ImageUploadService } from '../../../services/image-upload.service';

@Component({
  selector: 'app-image-crop',
  standalone: true,
  imports: [ CommonModule, FormsModule, ImageCropperComponent, FaIconComponent, ModalDialogComponent ],
  templateUrl: './image-crop.component.html',
  styleUrl: './image-crop.component.scss'
})
export class ImageCropComponent implements OnChanges {
    imageChangedEvent: any = null;
    croppedImage: SafeUrl = '';
    @Input() image_url = '';
    @Output() croppedImageBlob: Blob | null = null;
    @Output() imageCleared = new EventEmitter<void>();
    @Output() newimageLoaded = new EventEmitter<void>();
    @ViewChild("cropper") cropper!: ImageCropperComponent;
    @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
    @ViewChild("image_adjust_modal") image_adjust_modal!: ModalDialogComponent;
    
    faFolderOpen: IconDefinition = faFolderOpen;
    faBan: IconDefinition = faBan;
    faMagnifyingGlassPlus: IconDefinition = faMagnifyingGlassPlus;
    faMagnifyingGlassMinus: IconDefinition = faMagnifyingGlassMinus;
    faCrop: IconDefinition = faCrop;

    // Drag and drop state
    isDragging = false;
    
    // Zoom control
    transform: ImageTransform = {
      scale: 1
    };
    zoomLevel = 1;
    minZoom = 0.1;
    maxZoom = 3;
    
    // Upload state
    isUploading = false;
    
    constructor(
      private sanitizer: DomSanitizer,
      private toastService: ToastService,
      //private imageUploadService: ImageUploadService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
      if(this.image_url){
        this.croppedImage = this.image_url;
      }
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    
    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl ?? '');
      this.croppedImageBlob = event.blob ?? null;
    }
    
    imageLoaded(image: LoadedImage) {
        //this.toastService.showSuccess("Image loaded");
        // Reset zoom when new image loads
        this.zoomLevel = 1;
        this.transform = { scale: 1 };
        this.image_adjust_modal.open();
    }
    
    cropperReady() {
        // cropper ready
    }
    
    loadImageFailed(event: any) {
      console.dir(event);
        this.toastService.showError("Failed to load image");
    }

    clearImage() {
      // Properly clear the image
      this.imageChangedEvent = null;
      this.croppedImage = '';
      this.croppedImageBlob = null;
      this.zoomLevel = 1;
      this.transform = { scale: 1 };
      
      // Reset file input using ViewChild
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
      this.imageCleared.emit();
    }

    newImageLoaded(){
      this.newimageLoaded.emit();
    }
    
    // Drag and Drop functionality
    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = true;
    }
    
    @HostListener('dragleave', ['$event'])
    onDragLeave(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = false;
    }
    
    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = false;
      
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        
        // Check if it's an image
        if (!file.type.startsWith('image/')) {
          this.toastService.showError('Please drop an image file');
          return;
        }
        
        // Create a proper FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        
        // Update the file input
        if (this.fileInput) {
          this.fileInput.nativeElement.files = dataTransfer.files;
        }
        
        // Create an event object that ngx-image-cropper expects
        const changeEvent = new Event('change', { bubbles: true });
        Object.defineProperty(changeEvent, 'target', {
          writable: false,
          value: { files: dataTransfer.files }
        });
        
        this.imageChangedEvent = changeEvent;
        //this.toastService.showSuccess('Image loaded from drop');
      }
    }
    
    // Zoom functionality
    onZoomChange(value: number) {
      this.zoomLevel = value;
      this.transform = {
        ...this.transform,
        scale: this.zoomLevel
      };
    }
    
    zoomIn() {
      if (this.zoomLevel < this.maxZoom) {
        this.zoomLevel = Math.min(this.zoomLevel + 0.1, this.maxZoom);
        this.onZoomChange(this.zoomLevel);
      }
    }
    
    zoomOut() {
      if (this.zoomLevel > this.minZoom) {
        this.zoomLevel = Math.max(this.zoomLevel - 0.1, this.minZoom);
        this.onZoomChange(this.zoomLevel);
      }
    }
    
    resetZoom() {
      this.zoomLevel = 1;
      this.onZoomChange(this.zoomLevel);
    }
}