import { Component } from '@angular/core';
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
    protected activatedRoute: ActivatedRoute
  ) {
    // Only show toast if this component matches the activated route
    const routeComponent = this.activatedRoute.routeConfig?.component;
    if (routeComponent && this.constructor === routeComponent) {
      this.showNavigationToastIfMessagePending();
    }
  }

  navigateWithToastMessage(destination: string, message: string, isError: boolean = false){
    if(destination !== this.router.url) {
      this.performNavigation(destination, message, isError);
    }
    else {
      //handle navigation to the same url, which doesn't trigger navigation events and thus won't show the toast message if we rely on those events to show it. To work around this, we navigate away and then back to the destination.
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.performNavigation(destination, message, isError);
      });
    }
  }

  reloadTheSamePageWithToastMessage(message: string, isError: boolean = false){
    this.navigateWithToastMessage(this.router.url, message, isError);
  }

  performNavigation(destination: string, message: string, isError: boolean){
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
    let nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state && nav.extras.state['info'] && nav.extras.state['info']['textInfo']) {
      let info = nav.extras.state['info']['textInfo'];
      let isError = nav.extras.state['info']['isError'];
      if(isError)
      {
        this.toastService.showError(info);
      }
      else
      {
        this.toastService.showSuccess(info);
      }
      
    }
    else
    {
      //alert("empty");
      const state = this.stateService.getState();
      if(state && state.message){
        if(!state.isError) {
          this.toastService.showSuccess(state.message);
        }
        else {
          this.toastService.showError(state.message);
        }
      }
      this.stateService.clearState();
    }    
  }
}
