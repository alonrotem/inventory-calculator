import { EventEmitter, Injectable, Output } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GlobalsService {

  private theme: BehaviorSubject<string>;
  @Output() themeChanged = new EventEmitter<string>();

  constructor() {
    let curTheme = localStorage.getItem("currentTheme");
    if(!curTheme || (curTheme != "dark" && curTheme != "light")) {
      curTheme = "dark";
    }
    this.theme = new BehaviorSubject<string>(curTheme);
  }

  currentTheme():string {
    return this.theme.getValue();
  }

  getTheme(): Observable<string> {
    return this.theme.asObservable();
  }

  seTheme(newValue: string): void {
    this.theme.next(newValue);
    localStorage.setItem("currentTheme", newValue);
    this.themeChanged.emit(newValue);
  }
}