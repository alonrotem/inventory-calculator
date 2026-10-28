import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faArrowLeft, faPenRuler, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { KnivesService } from '../../../services/knives.service';
import { ToastService } from '../../../services/toast.service';
import { GlobalsService } from '../../../services/globals.service';
import { UnsavedNavigationConfirmationService } from '../../../services/unsaved-navigation-confirmation.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { PageLoadingComponent } from '../../common/page-loading/page-loading.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { UnsavedChangesDialogComponent } from '../../common/unsaved-changes-dialog/unsaved-changes-dialog.component';
import { SaveChangesButtonComponent } from '../../common/save-changes-button/save-changes-button.component';
import { Knife } from '../../../../types';
import { DEFAULT_PREVIEW_BABIES, drawKnife } from '../knife-editor/knife-render';

@Component({
  selector: 'app-knife-details',
  standalone: true,
  imports: [
    FormsModule, DecimalPipe, RouterModule, FaIconComponent, PageLoadingComponent,
    ConfirmationDialogComponent, UnsavedChangesDialogComponent, SaveChangesButtonComponent
  ],
  templateUrl: './knife-details.component.html',
  styleUrl: './knife-details.component.scss'
})
export class KnifeDetailsComponent implements OnInit, AfterViewInit, OnDestroy, HasUnsavedChanges {

  @ViewChild('knife_canvas') knifeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('knife_form') knife_form!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild('unsaved_changes_dialog') unsaved_changes_dialog!: UnsavedChangesDialogComponent;

  faArrowLeft: IconDefinition = faArrowLeft;
  faSave: IconDefinition = faSave;
  faTrashAlt: IconDefinition = faTrashAlt;
  faPenRuler: IconDefinition = faPenRuler;

  knife: Knife | null = null;
  name = '';
  showBabies = false;
  loading = true;
  saving = false;

  private color = '';
  private resizeObserver?: ResizeObserver;
  private themeSubscription: Subscription;

  constructor(
    private knivesService: KnivesService,
    private toastService: ToastService,
    private globalService: GlobalsService,
    private unsavedNavigationConfirmationService: UnsavedNavigationConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.setColors(this.globalService.currentTheme());
    this.themeSubscription = this.globalService.themeChanged.subscribe({
      next: (theme: string) => {
        this.setColors(theme);
        this.draw();
      }
    });
  }

  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.unsavedNavigationConfirmationService.handle({
      hasChanges: () => !!this.knife_form && !this.knife_form.pristine,
      saveFn: () => this.knivesService.save(this.editedKnife()),
      confirmationDialog: this.unsaved_changes_dialog
    });
  }

  async ngOnInit() {
    const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
    if (!id) {
      this.gotoKnivesList('No knife was selected', true);
      return;
    }
    try {
      const knife = await firstValueFrom(this.knivesService.getKnife(id));
      if (!knife?.id) {
        this.gotoKnivesList('Could not find knife with ID ' + id, true);
        return;
      }
      this.knife = knife;
      this.name = knife.name;
    }
    catch (e: any) {
      this.gotoKnivesList(e?.error?.message ?? 'Could not load the knife', true);
      return;
    }
    finally {
      this.loading = false;
    }
    // the canvas is shown once loaded; loading the name doesn't count as a change
    setTimeout(() => {
      this.knife_form?.form.markAsPristine();
      this.draw();
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => this.draw());
      this.resizeObserver.observe(this.knifeCanvas.nativeElement.parentElement!);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.themeSubscription.unsubscribe();
  }

  setColors(theme: string) {
    this.color = (theme == 'dark') ? '#f8f9fa' : '#212529';
  }

  private editedKnife(): Knife {
    return { ...this.knife!, name: this.name.trim() };
  }

  save(navigate_after_save: boolean = true) {
    if (!this.knife) {
      return;
    }
    this.knife_form.form.markAllAsTouched();
    if (!this.knife_form.form.valid || !this.name.trim()) {
      this.toastService.showError("Please fill all the mandatory fields before saving!");
      return;
    }
    this.saving = true;
    this.knivesService.save(this.editedKnife()).subscribe({
      next: (data) => {
        this.saving = false;
        this.knife_form.form.markAsPristine();
        if (navigate_after_save) {
          this.gotoKnivesList(data['message'], false);
        }
        else {
          this.knife = data['knife'];
          this.name = data['knife'].name;
          this.toastService.showSuccess(data['message']);
        }
      },
      error: (error) => {
        this.saving = false;
        this.toastService.showError(error.error?.['message'] ?? 'Could not save the knife');
      }
    });
  }

  async confirm_delete() {
    if (!this.knife) {
      return;
    }
    const confirmed = await this.delete_confirmation.open_with_message({
      modalText: `Are you sure you want to delete this knife, ${this.knife.name}?`,
      modalTitle: "Delete confirmation",
      btnYesIcon: this.faTrashAlt,
      btnYesText: "Delete",
      btnYesClass: "btn-danger"
    });
    if (confirmed) {
      this.knivesService.deleteKnife(this.knife.id).subscribe({
        next: (data) => {
          this.knife_form.form.markAsPristine();
          this.gotoKnivesList(data['message'], false);
        },
        error: (error) => {
          this.toastService.showError(error.error?.['message'] ?? 'Could not delete the knife');
        }
      });
    }
  }

  gotoKnivesList(textInfo: string = '', isError: Boolean = false) {
    this.router.navigate(['templates/knives/list'], {
      state: {
        info: {
          textInfo: textInfo,
          isError: isError
        }
      },
    });
  }

  advancedEdit() {
    if (this.knife) {
      this.router.navigate(['/templates/knives/editor'], { queryParams: { id: this.knife.id } });
    }
  }

  draw() {
    const canvas = this.knifeCanvas?.nativeElement;
    if (!canvas || !this.knife || !canvas.clientWidth) {
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawKnife(ctx, canvas.clientWidth, canvas.clientHeight, this.knife, {
      color: this.color,
      showRegions: !this.showBabies,
      babies: this.showBabies ? DEFAULT_PREVIEW_BABIES : null
    });
  }
}
