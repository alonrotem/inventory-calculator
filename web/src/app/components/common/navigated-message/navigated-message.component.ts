import { Component, Inject } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { StateService } from '../../../services/state.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigated-message',
  standalone: true,
  imports: [],
  templateUrl: './navigated-message.component.html',
  styleUrl: './navigated-message.component.scss'
})
export abstract class NavigatedMessageComponent {
  constructor(
    protected toastService: ToastService,
    protected stateService: StateService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    @Inject(Boolean) protected suppressNavigationToast: boolean = false
  ) {
    // Only show toast if this component matches the activated route
    const routeComponent = this.activatedRoute.routeConfig?.component;
    if (routeComponent && this.constructor === routeComponent && !this.suppressNavigationToast) {
      this.showNavigationToastIfMessagePending();
    }
  }

  navigateWithToastMessage(destination: string, message: string, isError: boolean = false, queryParams?: Record<string, any>) {
    const currentUrlTree = this.router.parseUrl(this.router.url);
    const destUrlTree = this.router.parseUrl(destination);
    // Merge/override query params if provided
    if (queryParams) {
      destUrlTree.queryParams = { ...destUrlTree.queryParams, ...queryParams };
    }
    const destUrlWithParams = this.router.serializeUrl(destUrlTree);

    // Compare path and query params
    const isSamePath = destUrlTree.root.toString() === currentUrlTree.root.toString();
    const isSameQueryParams = JSON.stringify(destUrlTree.queryParams) === JSON.stringify(currentUrlTree.queryParams);

    if (!isSamePath || !isSameQueryParams) {
      this.performNavigation(destUrlWithParams, message, isError);
    } else {
      // If everything is the same, reload the same page with message
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.performNavigation(destUrlWithParams, message, isError);
      });
    }
  }

  reloadTheSamePageWithToastMessage(message: string, isError: boolean = false, queryParams?: Record<string, any>) {
    this.navigateWithToastMessage(this.router.url, message, isError, queryParams);
  }

  performNavigation(destination: string, message: string, isError: boolean) {
    console.log(`performNavigation to ${destination} with message: ${message} and isError: ${isError}`);
    // Parse the URL to extract path and query params
    const urlTree = this.router.parseUrl(destination);
    this.router.navigate([urlTree.root.children['primary']?.segments.map(s => s.path).join('/') || ''], {
      queryParams: urlTree.queryParams,
      queryParamsHandling: 'merge',
      state: {
        info: {
          textInfo: message,
          isError: isError
        }
      },
    });
  }

  showNavigationToastIfMessagePending(){
    console.log(`Checking for pending navigation message (url ${this.router.url})...`);
    const pendingMessage = this.getPendingMessage();
    if (pendingMessage) {
      if (pendingMessage.isError) {
        this.toastService.showError(pendingMessage.textInfo);
      } else {
        this.toastService.showSuccess(pendingMessage.textInfo);
      }
    }
    this.stateService.clearState();
  }

  getPendingMessage(): { textInfo: string, isError: boolean } | null {
    let nav = this.router.getCurrentNavigation();
    let info = null;
    let isError = false;

    const state = this.stateService.getState();
    if(state && state.message){
      info = state.message;
      isError = state.isError;
    }
    else {
      if (nav && nav.extras.state && nav.extras.state['info'] && nav.extras.state['info']['textInfo']) {
        info = nav.extras.state['info']['textInfo'];
        isError = nav.extras.state['info']['isError'];
      }
    }

    if(info) {
      return { textInfo: info, isError: isError };
    }
    return null;
  }
}
