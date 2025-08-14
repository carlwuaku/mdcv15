import { inject, Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Pipe({
  name: 'filterByPermissions'
})
export class FilterByPermissionsPipe implements PipeTransform {
  authService = inject(AuthService)

  transform(items: any[]): any[] {
    if (!items) return []

    return items.filter(
      item => {
        let permissions = item.permissions;
        if (!permissions) return items
        if (!Array.isArray(permissions)) { permissions = [permissions]; }
        return this.authService.currentUser?.permissions.some(permission => permissions.includes(permission))
      })
  }

}
