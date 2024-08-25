import { Component } from '@angular/core';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';
import { Location, NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ ThemeSelectorComponent, NgClass ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentUrl: string = '';

  constructor(private location: Location) {
    this.currentUrl = this.location.path();
  }
}
