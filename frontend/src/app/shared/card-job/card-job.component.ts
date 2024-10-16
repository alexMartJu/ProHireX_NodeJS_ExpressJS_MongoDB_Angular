import { Component, Input } from '@angular/core';
import { Job } from '../../core/models/job.model';

@Component({
  selector: 'app-card-job',
  templateUrl: './card-job.component.html',
  styleUrl: './card-job.component.css'
})
export class CardJobComponent {

  @Input() job: Job = {} as Job;

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
