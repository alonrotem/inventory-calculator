import { Component,Renderer2 } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { GlobalsService } from './services/globals.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from './components/common/footer/footer.component';
import { ToastComponent } from './components/common/toast/toast.component';
import { ModalDialogComponent } from "./components/common/modal-dialog/modal-dialog.component";
import { ConfirmationDialogComponent } from "./components/common/confirmation-dialog/confirmation-dialog.component";
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FontAwesomeModule, FooterComponent, ToastComponent, ModalDialogComponent ],
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
