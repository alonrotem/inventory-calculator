import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/common/confirmation-dialog/confirmation-dialog.component';

export interface HasUnsavedChanges {
  //hasUnsavedChanges(): boolean;
  hasUnsavedChanges: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
/*
export class UnsavedChangesGuard implements CanDeactivate<HasUnsavedChanges> {
  canDeactivate(component: HasUnsavedChanges): Observable<boolean> | boolean {
    if (component.hasUnsavedChanges()) {
      // Prompt the user to confirm leaving the page or perform other checks
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }
}
*/
export class UnsavedChangesGuard implements CanDeactivate<HasUnsavedChanges> {
    canDeactivate(
      component: HasUnsavedChanges
    ): Observable<boolean> | Promise<boolean> | boolean {
        return component.hasUnsavedChanges ? component.hasUnsavedChanges() : true;
    }
  }