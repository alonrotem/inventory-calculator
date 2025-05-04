import { Component, ElementRef, ViewChild } from '@angular/core';

/*
Adapted from https://codepen.io/elitsa_dimitrova/pen/LJWBVo
Source: https://www.sliderrevolution.com/resources/css-hamburger-menu/
*/

@Component({
  selector: 'app-hamburger',
  standalone: true,
  imports: [],
  templateUrl: './hamburger.component.html',
  styleUrl: './hamburger.component.scss'
})
export class HamburgerComponent {
  @ViewChild('hamburger') hamburger!: ElementRef;
  aria_expanded: boolean = false;
  
  expand() {
    const hamburgerElement = this.hamburger.nativeElement;
    hamburgerElement.classList.remove("collapsed");
    this.aria_expanded = true;
  }

  collapse() {
    const hamburgerElement = this.hamburger.nativeElement;
    hamburgerElement.classList.add("collapsed");
    this.aria_expanded = false;
  }
}
