import { Component,Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { GlobalsService } from './services/globals.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent {
  title = 'inventory-calculator';
  faCoffee = faCoffee;
  constructor(private renderer: Renderer2, private globals: GlobalsService) {
  }
  ngOnInit(){
    this.globals.getTheme().subscribe((res: string) => {
      if (res) {
        this.renderer.setAttribute(document.querySelector('html'), 'data-bs-theme', res);
      }
    });
  }
}
