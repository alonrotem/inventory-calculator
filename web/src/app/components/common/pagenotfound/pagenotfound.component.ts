import { Component } from '@angular/core';
import { GlobalsService } from '../../../services/globals.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.scss'
})
export class PagenotfoundComponent {

  logo_img:string = "logo-dark.png";

  constructor(private globalService: GlobalsService){
    this.set_logo_theme(this.globalService.currentTheme());
    this.globalService.themeChanged.subscribe({
      next: (theme: string) =>{
        this.set_logo_theme(theme);
      }
    });
  }

  set_logo_theme(theme: string){
    this.logo_img = `logo-${theme}.png`;
  }
}
