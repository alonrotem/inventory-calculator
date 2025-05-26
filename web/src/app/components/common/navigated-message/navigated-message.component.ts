import { Component } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { StateService } from '../../../services/state.service';
import { Router } from '@angular/router';

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
    protected router: Router) {
    }

  showNavigationToastIfMessagePending(){
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
