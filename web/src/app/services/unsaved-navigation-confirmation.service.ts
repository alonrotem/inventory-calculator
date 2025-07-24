import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { StateService } from './state.service';
import { UnsavedChangesDialogComponent } from '../components/common/unsaved-changes-dialog/unsaved-changes-dialog.component';

@Injectable({ providedIn: 'root' })

@Injectable({
  providedIn: 'root'
})
export class UnsavedNavigationConfirmationService {

  constructor(
    private stateService: StateService
  ) {}


    handle<T>({
    hasChanges,
    saveFn,
    confirmationDialog,
  }: {
    hasChanges: () => boolean,
    saveFn: () => Observable<T>,
    confirmationDialog: UnsavedChangesDialogComponent
  }): Observable<boolean> {
    if (!hasChanges()) return of(true);

    confirmationDialog.open();

    return new Observable<boolean>((observer) => {
      const sub_save_changes = confirmationDialog.save_click.pipe(first()).subscribe(() => {
        saveFn().subscribe({
          next: (result: any) => {
            this.stateService.setState({ message: result?.message || 'Saved successfully.', isError: false });
            observer.next(true);
            observer.complete();
          },
          error: () => {
            this.stateService.setState({ message: 'Error during save', isError: true });
            observer.next(false);
            observer.complete();
          }
        });
      });
      const sub_discard_changes = confirmationDialog.discard_click
        .pipe() // take the first result only
        .subscribe(() => {
          //console.log("discard");
          this.stateService.setState({ message: "Changes discarded", isError: false });
          observer.next(true);
        }); 

      return () => {
        sub_save_changes.unsubscribe();
        sub_discard_changes.unsubscribe();
      }
    });
  }
}
