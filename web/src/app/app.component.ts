import { Component,Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterEvent, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { GlobalsService } from './services/globals.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from './components/common/footer/footer.component';
import { ToastComponent } from './components/common/toast/toast.component';
import { ModalDialogComponent } from "./components/common/modal-dialog/modal-dialog.component";
import { ConfirmationDialogComponent } from "./components/common/confirmation-dialog/confirmation-dialog.component";
import { routes } from './app.routes';
import { UsersService } from './services/users.service';
import { authGuard } from './guards/auth.guard';
import { filter } from 'rxjs';

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

  constructor(
    private renderer: Renderer2, 
    private globals: GlobalsService,
    private usersService: UsersService, 
    private router: Router) 
    {  }
  
  ngOnInit(){
    this.globals.getTheme().subscribe((res: string) => {
      if (res) {
        this.renderer.setAttribute(document.querySelector('html'), 'data-bs-theme', res);
      }
    });

    this.usersService.user$.subscribe(user => {
      if (!user && this.isCurrentRouteGuarded()) {
        console.log('Session cleared on a protected route. Redirecting...');
        this.router.navigate(['/users/signin'], { 
          state: {
            info: { going_to: this.router.url }
          },
        });
      }
    });

    /*
    this.usersService.get_admins_count().subscribe((admins_count:number) => {
      console.log("checking admins, got " + admins_count);
      if (admins_count == 0) {
        this.router.navigate(['/users/signup']);
      }
    });
    */
   // 2. Watch for Navigation attempts (covers link clicks)
    this.router.events.pipe(
      filter((event: any): event is NavigationStart => event instanceof NavigationStart)).subscribe((event) => {
        console.log("-> wanting to go to " + event.url);
      this.check_if_any_admins_were_created(event.url);
    });
  }

  private isCurrentRouteGuarded(): boolean {
    // Get the deepest activated route
    let root = this.router.routerState.snapshot.root;
    while (root.firstChild) {
      root = root.firstChild;
    }

    // Check if the authGuard is present in the canActivate array
    // Note: We check against the actual function reference 'authGuard'
    const guards = root.routeConfig?.canActivate;
    return !!guards && guards.includes(authGuard);
  }

  private check_if_any_admins_were_created(wanting_to_go_to_url: string) {
    if(!wanting_to_go_to_url.startsWith("/users/verify") && !wanting_to_go_to_url.startsWith("/users/signup")){
      this.usersService.get_admins_count().subscribe((admins_count:number) => {
        console.log("checking admins, got " + admins_count);
        if (admins_count == 0) {
          this.router.navigate(['/users/signup']);
        }
      });
    }
  }
}
