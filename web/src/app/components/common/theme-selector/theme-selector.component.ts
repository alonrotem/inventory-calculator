import { Component } from '@angular/core';
import { GlobalsService } from '../../../services/globals.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [ FontAwesomeModule, FaIconComponent ],
  selector: 'app-theme-selector',
  standalone: true,
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
  providers: [  ]
})
export class ThemeSelectorComponent {
  icon = faMoon;

  constructor(private globals: GlobalsService){
  }
  toggleTheme (){
    let theme = this.globals.currentTheme();
    if(theme == "dark")
    {
      this.globals.seTheme("light");
      this.icon = faSun;
    }
    else
    {
      this.globals.seTheme("dark");
      this.icon = faMoon;
    }  
  }
}
