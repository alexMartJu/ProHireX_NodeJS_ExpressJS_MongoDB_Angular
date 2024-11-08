import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAdminService } from '../../core';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoAuthAdminGuard implements CanActivate {

  constructor(private router: Router,
    private userAdminService: UserAdminService) { }

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean> {
      return this.userAdminService.isAuthenticated.pipe(
        take(1),
        map(isAuthenticated => {
          if (isAuthenticated) {
            this.router.navigate(['/dashboard_TypeORM']); 
            return false; 
            
          } else {
            return true;
          }
        })
      );
    }
}
