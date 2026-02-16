import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, catchError, firstValueFrom, from, InteropObservable, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AccountRequestDetails, AccountRequestInfo, AccountRequestListItem, AccountsRequestList, BasicUserInfoStatus, GeoCoordinates, LoginInfo, nameIdPair, PaginationParams, RefreshResponse, SignInData, SignInResponse, UpdateProfile, UserProfile } from '../../types';
import { RuntimeService } from './runtime.service';

export interface AreaPermission {
  area: string;
  permission: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // 1. Set the initial value to null
  private userSubject = new BehaviorSubject<BasicUserInfoStatus | null>(null);
  
  // 2. Expose as an Observable of User or null
  user$ = this.userSubject.asObservable();

  // 3. Convenience getter for the current value (synchronous)
  get currentUserValue(): BasicUserInfoStatus | null {
    const userstr = sessionStorage.getItem("User");
    if(userstr){
      const user: BasicUserInfoStatus = JSON.parse(userstr);
      return user;//this.userSubject.value;
    }
    return null;
  }

  setUser(user: BasicUserInfoStatus | null) {
    sessionStorage.setItem("User", JSON.stringify(user));
    this.userSubject.next(user);
  }

  unsetUser(){
    sessionStorage.removeItem("User");
    this.userSubject.next(null);
  }

  constructor(private apiService: ApiService, private runtimeService: RuntimeService, private router: Router) {
    // 🎯 Load from storage immediately on construction
    const savedUser = sessionStorage.getItem("User");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // If your storage structure is { info: { ... } }, use parsed.info
        this.userSubject.next(parsed.info || parsed);
      } catch (e) {
        sessionStorage.removeItem("User");
      }
    }
  }
  
  setAccessToken(token: string): void {
    localStorage.setItem("access_token", token.toString());
  }

  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  signupNewUser (signupData: { firstname: string, lastname: string, username: string, password: string, email: string , role: string}): Observable<any> {
    return this.apiService.post(`${environment.serverUrl}/users/signup`, signupData, { });
  }

  sendUserAccountVerificationCode = (email_address: string): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/users/send-user-account-verification-code`, { email_address }, { });
  }

  verifyUserSignUpCode = (code: string): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/users/verify-user-account-code`, { code }, { });
  }

  changePassword = (code: string, password: string, sign_out_from_all: boolean = true): Observable<any> => {
    const cpr = this.apiService.post(`${environment.serverUrl}/users/reset-password`, { code, password, sign_out_from_all }, { });
    return cpr.pipe(
      map((response: any) => {
        if(sign_out_from_all){
          this.purge();
        }
        return response;
      })
    )    
  }

  userForgotPassword = (email_address: string): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/users/forgot-password`, { email_address }, { });
  }

  sendChangedEmailConfirmationCode(email_address: string): Observable<any> {
    return this.apiService.post(`${environment.serverUrl}/users/send-changed-email-verification-code`, { email_address }, { });
  }

  verifyNewEmailCode(email_verification_code: string, cancel_new_address: boolean): Observable<any> {
    return this.apiService.post(`${environment.serverUrl}/users/verify-new-email-code`, { email_verification_code, cancel_new_address }, { });
  }

  /*
  signIn (signinData: SignInData): Observable<BasicUserInfoStatus> {
    const obs = this.apiService.post<SignInResponse>(`${environment.serverUrl}/users/signin`, signinData, { withCredentials: true });
    return obs.pipe(
      map((response: SignInResponse) => {
        console.log("signin response");
        console.dir(response);
        this.setAccessToken(response.access_token);
        this.setUser(response.userInfo);
        return response.userInfo;
      })
    )
  }
  */
  signIn(signinData: SignInData): Observable<BasicUserInfoStatus> {
    return from((async () => {
      // Get location data first
      let locationData = null;
      
      try {
        let coords = await this.runtimeService.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
        //coords = { latitude: 42.680400235535714, longitude: 23.311328531456066, accuracy: 0 };
        
        
        if (coords) {
          signinData.origin_geolocation = `${coords.latitude},${coords.longitude}`;

          const address = await this.runtimeService.getReverseGeocode(
            coords.latitude, 
            coords.longitude
          );
          
          signinData.origin_city = address.address.city;
          signinData.origin_country = (address.address.state)? `${address.address.state}, `: '';
          signinData.origin_country += address.address.country;
        }
      } 
      catch (error) {
        console.warn('Failed to get location:', error);
      }

      signinData.origin_browser = this.runtimeService.getBrowserName();
      signinData.origin_os = this.runtimeService.getOS();
      
      const response = await firstValueFrom(
        this.apiService.post<SignInResponse>(
          `${environment.serverUrl}/users/signin`, 
          signinData, 
          { withCredentials: true }
        )
      );
      
      console.log("signin response");
      console.dir(response);
      this.setAccessToken(response.access_token);
      this.setUser(response.userInfo);
      
      return response.userInfo;
    })());
  }

  sendRequestForNewAccount(account_request: AccountRequestInfo): Observable<any>{
    return this.apiService.post(`${environment.serverUrl}/users/request_account`, account_request, { responseType: 'json' });
  }

  getAccountRequests(params: PaginationParams): Observable<AccountsRequestList>{
    return this.apiService.get(`${environment.serverUrl}/users/account_requets`, { responseType: 'json', params, withCredentials: true });
  }

  getAccountRequestDetails = (id: number): Observable<AccountRequestDetails> => {
    return this.apiService.get(`${environment.serverUrl}/users/account_requet/${id}`, {
      responseType: 'json',
      withCredentials: true
    });
  };

  deleteAccountRequest = (id: number): Observable<boolean> => {
    return this.apiService.delete(`${environment.serverUrl}/users/account_requet/${id}`, {
      responseType: 'json',
      withCredentials: true
    });
  }

  approveAccountRequest(request: AccountRequestDetails): Observable<AccountRequestDetails>{
    return this.apiService.post(`${environment.serverUrl}/users/account_requet/approve`, request, {
      responseType: 'json',
      withCredentials: true
    });
  }

  getRoles():Observable<nameIdPair[]> {
    return this.apiService.get(`${environment.serverUrl}/users/roles/`, { responseType: 'json' });
  }

  checkSignInStatus(): Observable<BasicUserInfoStatus> {
    const emptyUser: BasicUserInfoStatus = {
      id: 0,
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      roles: [],
      photo_url: '',
      customers: [],
      area_permissions: []
    };
    return this.apiService.get<BasicUserInfoStatus>(
      `${environment.serverUrl}/users/status`, 
      { withCredentials: true }
    ).pipe(
      // 1. Use tap for side effects (updating state)
      tap({
        next: (info) => {
          console.dir(info);
          console.log('Session active:', info.username);
          this.setUser(info);
          //this.userSubject.next(info); // Update your BehaviorSubject
          //sessionStorage.setItem("User", JSON.stringify({ info }));
        },
        error: (error: HttpErrorResponse) => {
          console.log("SESSION ERROR ");
          console.dir(error);
          if (error.status === 401 || error.status === 403) {
            console.warn(`Session invalid (${error.status}). Clearing state.`);
            //this.setUser(null); // Set userSubject to null
            //sessionStorage.removeItem("User");
            this.unsetUser();
          }
        }
      }),

      // 2. catchError handles the stream so the app doesn't crash
      catchError((error) => {
        console.error("Service caught error:", error);
        //this.setUser(null);
        this.unsetUser();
        return of(emptyUser); // 🎯 This MUST be returned to trigger the Guard's 'else' block
      })
    );
  }

  refreshAccessToken(): Observable<string | null> {
    return this.apiService.get<RefreshResponse>(`${environment.serverUrl}/users/refresh`, { withCredentials: true }).pipe(
      tap({
        next: (res: RefreshResponse) => {
          console.log("refresh token response");
          console.dir(res);

          this.setAccessToken(res.access_token);
        }
      }),
      map((res: RefreshResponse) => res.access_token),

      catchError(err => {
        // This means the Refresh Token was invalid/expired/missing (401 or 403 response)
        this.logout();
        return of(null); // Stop the flow by emitting a null value
      })
    );
  }

  /**
   * PURGE: Local cleanup only.
   * Used by the Interceptor when a token refresh fails.
   */
  purge(): void {
    this.setAccessToken("");
    //this.setUser(null);
    this.unsetUser();
    //sessionStorage.removeItem("User");
  }

  /**
   * LOGOUT: API call + Local Cleanup.
   * Returns an Observable as requested.
   */
  logout(): Observable<{ message: string }> {
    return this.apiService.get<{ message: string }>(
      `${environment.serverUrl}/users/logout`, 
      { withCredentials: true }
    ).pipe(
      tap({
        next: (response) => {
          console.log('Server logout successful:', response.message);
          this.purge(); // 🎯 Always purge on success
        },
        error: (err) => {
          console.error('Server logout failed, purging locally anyway', err);
          this.purge(); // 🎯 Purge even if server fails (e.g., cookie already gone)
        }
      })
    );
  }

  get_logins(): Observable<LoginInfo[]>{
    return this.apiService.get(`${environment.serverUrl}/users/get_logins`, {
      responseType: 'json',
      withCredentials: true
    });
  }

  clear_logins(ids: number[]): Observable<LoginInfo[]>{
    return this.apiService.post(`${environment.serverUrl}/users/clear_logins`, { ids }, {
      responseType: 'json',
      withCredentials: true
    });
  }

  get_admins_count(): Observable<number> {
    return this.apiService.get<any>(`${environment.serverUrl}/users/admins_count`, { }).pipe(
      map((response: { admins: number}) => {
        return response.admins; 
      })
    );
  }

  getProfile (): Observable<UserProfile> {
    return this.apiService.get(`${environment.serverUrl}/users/profile/`, {
      responseType: 'json',
      withCredentials: true
    });
  }

  getProfile_by_code (profile_code: string = ""): Observable<UserProfile> {
    return this.apiService.get(`${environment.serverUrl}/users/profile_by_code/${profile_code}`, {
      responseType: 'json'
    });
  }
  
  saveProfile_by_code(profileUpdateInfo: UpdateProfile, profilePicture: Blob | null, profile_code: string): Observable<UserProfile> {
    const formData = this.collect_form_data(profileUpdateInfo, profilePicture);
    formData.append("profile_code", profile_code);
    return this.apiService.post(`${environment.serverUrl}/users/profile_by_code/`, formData, { responseType: 'json' });
  }

  saveProfile(profileUpdateInfo: UpdateProfile, profilePicture: Blob | null): Observable<UserProfile> {
    const formData = this.collect_form_data(profileUpdateInfo, profilePicture);
    return this.apiService.post(`${environment.serverUrl}/users/profile`, formData, { withCredentials: true });
  }
  
  collect_form_data(profileUpdateInfo: UpdateProfile, profilePicture: Blob | null): FormData {
    const formData = new FormData();
    
    // Automatically append all properties from data object
    Object.keys(profileUpdateInfo).forEach(key => {
      const value = profileUpdateInfo[key as keyof UpdateProfile];
      
      if (value !== undefined && value !== null) {
        // Handle arrays (like tags)
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } 
        // Handle objects
        else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        }
        // Handle primitives (string, number, boolean)
        else {
          formData.append(key, String(value));
        }
      }
    });
    if(profilePicture){
      //console.log('Appending picture');
      //console.dir(profilePicture);
      formData.append('photo', profilePicture, 'profile.png');
    }
    return formData;
  }

  does_user_have_access_to_area(user: BasicUserInfoStatus | null, required_permissions: AreaPermission[]): boolean {
    if (!user?.area_permissions) return false;
    
    let allowed: boolean = false;
    if(required_permissions) {
      required_permissions.forEach(p => {
        const areaPermission = user.area_permissions.find(ap => ap.area === p.area);
        if(areaPermission && areaPermission.permissions && areaPermission?.permissions.includes(p.permission)){
          allowed = true;
        }
      });
    }
    //not restricted
    else {
      allowed = true;
    }
    return allowed;
  }
}
