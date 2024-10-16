import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Job, JobService, UserService } from '../../core';
import { of } from 'rxjs';
import { concatMap ,  tap } from 'rxjs/operators';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.css'
})
export class FavoriteButtonComponent {

  constructor(
    private JobService: JobService,
    private router: Router,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  @Input() jobs: Job = {} as Job;
  @Output() toggle = new EventEmitter<boolean>();
  isSubmitting = false;

  toggleFavorite() {
    this.isSubmitting = true;

    this.userService.isAuthenticated.pipe(concatMap(
      (authenticated) => {
        // Not authenticated? Push to login screen
        if (!authenticated) {
          this.router.navigateByUrl('/auth/login');
          return of(null);
        }

        // Favorite the article if it isn't favorited yet
        if (!this.jobs.favorited) {
          return this.JobService.favorite(this.jobs.slug)
          .pipe(tap(
            data => {
              this.isSubmitting = false;
              this.toggle.emit(true);
            },
            err => this.isSubmitting = false
          ));

        // Otherwise, unfavorite the article
        } else {
          return this.JobService.unfavorite(this.jobs.slug)
          .pipe(tap(
            data => {
              this.isSubmitting = false;
              this.toggle.emit(false);
            },
            err => this.isSubmitting = false
          ));
        }

      }
    )).subscribe(() => {
      this.cd.markForCheck();
    });
  }
}