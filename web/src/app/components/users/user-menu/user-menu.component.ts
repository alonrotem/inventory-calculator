import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { BasicUserInfoStatus } from '../../../../types';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faAddressCard, faArrowRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [ RouterLink, NgIf, NgClass, AsyncPipe, FaIconComponent ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnInit {

  userInfo: BasicUserInfoStatus = {
    id: 0,
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    roles: [],
    photo_url: '',
    customers: [],
    area_permissions: []
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
  
  constructor(private usersService: UsersService, private router: Router){
   this.refreshUserInfo();
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

  refreshUserInfo(){

  }

  logout(){
    this.usersService.logout().subscribe({
      next: (response: {message: string}) => {
        //alert(response.message);
        this.refreshUserInfo();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
