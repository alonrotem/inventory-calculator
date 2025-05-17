import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private state: any = null;

  setState(state: any): void {
    this.state = state;
  }

  getState<T = any>(): T | null {
    const temp = this.state;
    this.clearState(); // Optional: one-time use
    return temp;
  }

  clearState(): void {
    this.state = null;
  }
}
