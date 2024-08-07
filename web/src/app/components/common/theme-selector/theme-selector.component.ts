import { Component, ElementRef, ViewChild } from '@angular/core';
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
  providers: [ ]
})
export class ThemeSelectorComponent {
  icon = faMoon;

  constructor(private globals: GlobalsService){
    this.icon = this.globals.currentTheme()=="dark"? faMoon :  faSun;
  }
  toggleTheme (){
    let theme = this.globals.currentTheme();
    if(theme == "dark")
    {
      this.globals.seTheme("light");
      this.icon = faSun;
      /*
      this.indicator.classList.add("fa-icon-sun");
      this.indicator.classList.remove("fa-icon-moon");
      */
    }
    else
    {
      this.globals.seTheme("dark");
      this.icon = faMoon;
      /*
      this.indicator.classList.add("fa-icon-moon");
      this.indicator.classList.remove("fa-icon-sun");
      */
    }
  }

/*
  function toggleMode()
{
	let darkbright_icon = document.getElementById("darkbright-icon");
	if(document.body.classList.contains("dark"))
  {
  	document.body.classList.remove("dark");
    document.body.classList.remove("bright");
    darkbright_icon.classList.remove("fa-moon");
    darkbright_icon.classList.add("fa-sun");
  }
  else
  {
  	document.body.classList.remove("bright");
    document.body.classList.add("dark");  
  	darkbright_icon.classList.remove("fa-sun");
    darkbright_icon.classList.add("fa-moon");
  }
}*/
}
