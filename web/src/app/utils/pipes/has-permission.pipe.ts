import { Pipe, PipeTransform } from '@angular/core';
import { BasicUserInfoStatus } from '../../../types';
import { AreaPermission, UsersService } from '../../services/users.service';



@Pipe({
  name: 'hasPermission',
  standalone: true
})
export class HasPermissionPipe implements PipeTransform {
  constructor(private usersService: UsersService){}

  transform(user: BasicUserInfoStatus | null, required_permissions: AreaPermission[]): boolean {
    return this.usersService.does_user_have_access_to_area(user, required_permissions);
    /*
    if (!user?.area_permissions) return false;
    
    let allowed: boolean = false;
    required_permissions.forEach(p => {
      const areaPermission = user.area_permissions.find(ap => ap.area === p.area);
      if(areaPermission && areaPermission.permissions && areaPermission?.permissions.includes(p.permission)){
        allowed = true;
      }
    });
    return allowed;
    */
  }
}

/**
import { Pipe, PipeTransform } from '@angular/core';
import { BasicUserInfoStatus, UserAreaPermissions } from './your-types';

@Pipe({
  name: 'hasPermission'
})
export class HasPermissionPipe implements PipeTransform {
  transform(user: BasicUserInfoStatus | null, area: string, permission: string): boolean {
    if (!user?.area_permissions) return false;
    
    const areaPermission = user.area_permissions.find(ap => ap.area === area);
    return areaPermission?.permissions.includes(permission) ?? false;
  }
}
 */