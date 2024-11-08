import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserEnterpriseService } from '../../core';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthEnterpriseGuard implements CanActivate {

  constructor(
    private router: Router,
    private userEnterpriseService: UserEnterpriseService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userEnterpriseService.isAuthenticated.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true; // Permitir acceso a usuarios enterprise autenticados
        } else {
          this.router.navigate(['/home']); // Redirigir a home si no es usuario enterprise
          return false;
        }
      })
    );
  }
}
