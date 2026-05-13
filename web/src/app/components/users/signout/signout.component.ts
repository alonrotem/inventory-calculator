import { Component, OnInit } from '@angular/core';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { StateService } from '../../../services/state.service';
import { ToastService } from '../../../services/toast.service';
import { UsersService } from '../../../services/users.service';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-signout',
  standalone: true,
  imports: [PageLoadingComponent],
  templateUrl: './signout.component.html',
  styleUrl: './signout.component.scss'
})
export class SignoutComponent extends NavigatedMessageComponent {
  constructor(toastService: ToastService, stateService: StateService, router: Router, activatedRoute: ActivatedRoute, private usersService: UsersService) {
    super(toastService, stateService, router, activatedRoute, true);

    const pendingNavigationMessage = this.getPendingMessage();

    this.usersService.logout().subscribe({
      next: (response: {message: string}) => {
        this.navigateWithToastMessage(
          'users/signin', pendingNavigationMessage && pendingNavigationMessage.textInfo ? pendingNavigationMessage.textInfo : 'Logged out successfully', 
          pendingNavigationMessage ? pendingNavigationMessage.isError : false
        );
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
