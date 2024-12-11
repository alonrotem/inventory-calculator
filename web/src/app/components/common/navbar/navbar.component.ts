import { Component } from '@angular/core';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';
import { Location, NgClass } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HamburgerComponent } from '../hamburger/hamburger.component';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ ThemeSelectorComponent, NgClass, RouterLink, RouterOutlet, HamburgerComponent ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentUrl: string = '';

  constructor(private location: Location, private router: Router, private route:ActivatedRoute) {
    //this.currentUrl = this.location.path();
    //console.log("this.location.path() " + this.location.path());
    //console.log("this.router.url " + this.router.url);
    //console.log("route " + route);
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        //console.log("e instanceof NavigationEnd " + e.url);
        this.currentUrl = e.url;
      }});
  }
}
