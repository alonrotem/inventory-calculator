import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GlobalsService {

  private theme: BehaviorSubject<string>;

  constructor() {
    this.theme = new BehaviorSubject<string>("dark");
  }

  currentTheme():string {
    return this.theme.getValue();
  }

  getTheme(): Observable<string> {
    return this.theme.asObservable();
  }

  seTheme(newValue: string): void {
    this.theme.next(newValue);
  }
}