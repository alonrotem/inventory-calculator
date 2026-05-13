import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { BasicUserInfoStatus } from '../../../../types';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faAddressCard, faArrowRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { StateService } from '../../../services/state.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [ RouterLink, NgIf, NgClass, AsyncPipe, FaIconComponent ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent extends NavigatedMessageComponent implements OnInit {

  userInfo: BasicUserInfoStatus = {
    id: 0,
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    roles: [],
    photo_url: '',
    customers: [],
    area_permissions: [],
    is_demo_customer: false,
    demo_customer_id: 0
  };
  initials = "";
  currentUrl: string = '';
  environment = environment;
  //isLoggedIn$ = this.usersService.isLoggedIn$;
  //user$ = this.usersService.user$;

  user$ = this.usersService.user$.pipe(
    tap(user => {
      if (user) {
        this.userInfo = user;
        this.setInitials();
      }
    })
  );

  faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;
  faRightToBracket: IconDefinition = faRightToBracket;
  faAddressCard: IconDefinition = faAddressCard;
  /**
   * 

   * constructor(
       protected toastService: ToastService,
       protected stateService: StateService,
       protected router: Router,
       protected activatedRoute: ActivatedRoute,
       @Inject(Boolean) protected suppressNavigationToast: boolean = false
   */
  constructor(toastService: ToastService, stateService: StateService, private usersService: UsersService, router: Router, activatedRoute: ActivatedRoute){
   
    super(toastService, stateService, router, activatedRoute, true);
   
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
      }});   
  }

  ngOnInit(): void {
    this.usersService.checkSignInStatus().subscribe(
    {
      next: (userInfo: BasicUserInfoStatus) => {
        //console.log("USER INFO REFRESHED");
        //console.dir(userInfo);
        this.userInfo = userInfo;
        this.setInitials();
      },
      error: (error) => {
        console.log("USER INFO ERROR");
        console.log(error);
      }
    });
  }
  
  setInitials(){
    //this.userInfo = userInfo;
    if(this.userInfo.firstname) {
      this.initials = this.userInfo.firstname[0];
    }
    if(this.userInfo.lastname) {
      this.initials += this.userInfo.lastname[0];
    }
    else if (this.userInfo.firstname.length > 1) {
      this.initials += this.userInfo.firstname[1];
    }    
  }

  logout(){
    let nextPageMessage = "Logged out successfully";
    let isError = false;
    let pendingNavigationMessage = this.getPendingMessage();
    if(pendingNavigationMessage && pendingNavigationMessage.textInfo) {
      nextPageMessage = pendingNavigationMessage.textInfo;
      isError = pendingNavigationMessage.isError;
    }
    this.navigateWithToastMessage('users/signout', nextPageMessage, isError);
  }
}
