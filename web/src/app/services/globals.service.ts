import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})

export class GlobalsService {

  private theme: BehaviorSubject<string>;

  constructor(private localStorage: LocalStorageService) {
    let curTheme = this.localStorage.getItem("currentTheme");
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
    this.localStorage.setItem("currentTheme", newValue);
  }
}