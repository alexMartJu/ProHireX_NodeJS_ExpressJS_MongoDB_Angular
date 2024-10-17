import { Component, Input } from '@angular/core';
import { Job } from '../../core/models/job.model';

@Component({
  selector: 'app-list-fav-jobs-profile',
  templateUrl: './list-fav-jobs-profile.component.html',
  styleUrl: './list-fav-jobs-profile.component.css'
})
export class ListFavJobsProfileComponent {
  @Input() job: Job = {} as Job;
  @Input() isUser: boolean = false;

  constructor() { }

  ngOnInit(): void {}

  onToggleFavorite(favorited: boolean) {
    this.job.favorited = favorited;

    if (favorited) {
      this.job.favoritesCount++;
    } else {
      this.job.favoritesCount--;
    }
  }
}
