import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Job} from '../core/models/job.model';
import { JobService } from '../core/services/job.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DetailsResolverService implements Resolve<Job>{

  constructor(
    private jobService: JobService,
        private router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.jobService.get_product(route.params['slug'])
    .pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
