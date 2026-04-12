import { Injectable, NgZone } from '@angular/core';
import { GeoCoordinates } from '../../types';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {

  constructor(private apiService: ApiService, private ngZone: NgZone) { }

  // Gets the user's geolocation data (if available)
  async getCurrentPosition(options?: PositionOptions): Promise<GeoCoordinates | null> {
    if (!navigator.geolocation) {
      return null;
    }
    
    //console.log('getCurrentPosition START', Date.now());
    
    return new Promise<GeoCoordinates | null>((resolve) => {
      this.ngZone.runOutsideAngular(() => {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => this.ngZone.run(() => {
            //console.log('getCurrentPosition SUCCESS', Date.now());
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed
            })
          }),
          (error: GeolocationPositionError) => this.ngZone.run(() => {
            //console.log('getCurrentPosition ERROR', Date.now(), error.code, error.message);
            resolve(null);
          }),
          options
        );
      });
    });
  }

  // gets the user's reverse geocode (address, city, country)
  async getReverseGeocode(latitude: number, longitude: number): Promise<any> {
    const url=`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    return await firstValueFrom(this.apiService.get(url, {})); 
  }

  // gets the user's browser
  getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edg') > -1:
        return 'Edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'Opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'Chrome';
      case agent.indexOf('trident') > -1:
        return 'IE';
      case agent.indexOf('firefox') > -1:
        return 'Firefox';
      case agent.indexOf('safari') > -1:
        return 'Safari';
      default:
        return 'Unknown browser';
    }
  }

  //get the user's browser
  getOS() {
    const userAgent = window.navigator.userAgent;
    
    const platform =
      (window.navigator as any)?.userAgentData?.platform || userAgent;

    const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
    const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
    const iosPlatforms = ["iPhone", "iPad", "iPod"];

    if (macosPlatforms.indexOf(platform) !== -1 || (macosPlatforms).find(os => platform.indexOf(os) >= 0) != undefined) {
      return "Mac OS";
    } 
    else if (iosPlatforms.indexOf(platform) !== -1 || (iosPlatforms).find(os => platform.indexOf(os) >= 0) != undefined) {
      return "iOS";
    } 
    else if (windowsPlatforms.indexOf(platform) !== -1 || (windowsPlatforms).find(os => platform.indexOf(os) >= 0) != undefined) {
      return "Windows";
    } 
    else if (/Android/.test(userAgent)) {
      return "Android";
    } 
    else if (/Linux/.test(platform)) {
      return "Linux";
    }
    return "Unknown";
  }
}
