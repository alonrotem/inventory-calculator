import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';
import { Location, NgClass } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HamburgerComponent } from '../hamburger/hamburger.component';
import { faBasketShopping, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ ThemeSelectorComponent, NgClass, RouterLink, RouterOutlet, HamburgerComponent, FaIconComponent ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit {
  currentUrl: string = '';
  faBasketShopping:IconDefinition = faBasketShopping;
  @ViewChild('navbarToggler') navbarToggler!: ElementRef;
  @ViewChild('hamburger') hamburger!: HamburgerComponent;

  //exp: navbar-collapse collapse show
  //col: navbar-collapse collapse

  constructor(private location: Location, private router: Router, private route:ActivatedRoute) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
      }});
  }
  ngAfterViewInit(): void {
    // Find all links inside the navbar with routerLink
    const links = this.navbarToggler.nativeElement.querySelectorAll('a[routerLink]');

    // Attach event listener to each link
    links.forEach((link: Element) => {
      link.addEventListener('click', () => this.collapse_mobile_menu());
    });
  }

  @HostListener('document:click', ['$event'])
  handleC_click_outside_the_expanded_mobile_menu(event: Event) {
    if (
      this.navbarToggler &&
      this.navbarToggler.nativeElement.classList.contains('show') &&
      !this.navbarToggler.nativeElement.contains(event.target)
    ) {
      this.collapse_mobile_menu();
    }
  }

  expand_mobile_menu(){
    const navbarCollapse = this.navbarToggler.nativeElement;
    navbarCollapse.classList.add("show");
    this.hamburger.expand();
  }

  collapse_mobile_menu(){
    const navbarCollapse = this.navbarToggler.nativeElement;
    navbarCollapse.classList.remove("show");
    this.hamburger.collapse();
  }
}
