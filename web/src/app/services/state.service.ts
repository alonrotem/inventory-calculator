import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private state: any = null;

  setState(state: any): void {
    this.state = state;
  }

  setStateProperty(key: string, value: any): void {
    if (!this.state) {
      this.state = {};
    }
    this.state[key] = value;
  }

  getStateProperty<T = any>(key: string): T | null {
    if (this.state && key in this.state) {
      return this.state[key] as T;
    }
    return null;
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
