// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { map, take } from 'rxjs/operators';


export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  // 1. Check if we already have a user in memory
  const currentUser = usersService.currentUserValue;

  if (currentUser && currentUser.id > 0) {
    const can_go =  usersService.does_user_have_access_to_area(currentUser, route.data["permissions"]);
    if(!can_go){
      router.navigate(['forbidden'], { skipLocationChange: true });
    }
    else 
      return can_go;
    /*
    //return true; // Proceed immediately
    const current_route_area = route.data['area'];
    const required_permissions = route.data['permission'];
    if(current_route_area && required_permissions){
      const user_permissions = currentUser.area_permissions.find(p => p.area == current_route_area); 
      if(user_permissions && user_permissions.permissions.indexOf(required_permissions) >= 0){
        return true;
      }
      else {
        router.navigate(['forbidden'], { skipLocationChange: true });
      }
    }
    return true;
    */
  }

  // 2. If memory is empty (e.g., after refresh), trigger a server check
  return usersService.checkSignInStatus().pipe(
    take(1), // 🎯 Force the observable to complete after the first emission
    map(status => {
      console.log("Guard received status:", status);
      if (status && status.id > 0) {
        return true;
      } else {
        return router.createUrlTree(['users/signin'], {
          queryParams: { returnUrl: state.url }
        });
      }
    })
  );
};
/*
export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  // We use the existing user$ observable (Subject) for the single source of truth
  return usersService.user$.pipe(
    take(1), // 🎯 Ensure the guard completes
    map(user => {
      console.log("CAUGUT USER ");
      console.dir(user);
      // Check if user object exists and has a valid ID
      if (user && user.id > 0) {
        return true; 
      } else {
        // 🎯 REDIRECT happens here ONLY for guarded routes
        router.navigate(['users/signin'], {
          state: {
            info: { going_to: state.url }
          },
        });
        return false;
      }
    })
  );
};
*/