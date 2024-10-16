import { Component, Input } from '@angular/core';
import { Job } from '../../core';

@Component({
  selector: 'app-list-jobs-on-profile',
  templateUrl: './list-jobs-on-profile.component.html',
  styleUrl: './list-jobs-on-profile.component.css'
})
export class ListJobsOnProfileComponent {

  @Input() jobs: Job = {} as Job;

  constructor() { }

  ngOnInit(): void {    
    // console.log(this.jobs);
  }  
}