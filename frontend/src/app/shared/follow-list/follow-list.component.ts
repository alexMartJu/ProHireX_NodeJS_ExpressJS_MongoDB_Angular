import { Component, OnInit, Input } from '@angular/core';
import { Follower_follow } from '../../core';

@Component({
  selector: 'app-follow-list',
  templateUrl: './follow-list.component.html',
  styleUrls: ['./follow-list.component.css']
})
export class FollowListComponent implements OnInit {
  @Input() followersss: Follower_follow = {} as Follower_follow;
  @Input() follow: Follower_follow = {} as Follower_follow;
  @Input() pages_profile!: string;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.pages_profile);
  }

}