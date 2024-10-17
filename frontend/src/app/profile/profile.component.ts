import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User, UserService, Profile, Follower_follow, ProfileService, Job } from '../core';
import { concatMap ,  tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private ProfileService: ProfileService
  ) { }

  profile!: Profile;
  currentUser!: User;
  isUser!: boolean;
  username!: string | null; 
  pages_profile: string = "jobs";
  img: any;
  bio: any;
  num_followers: any;
  num_follows: any;
  author!: Profile;
  profile_user!: Profile;
  followers: Follower_follow[] = [{username: '', bio: '', image: ''}];
  follows: Follower_follow[] = [{username: '', bio: '', image: ''}];
  jobs: Job[] = [];
  favouriteJobs: Job[] = [];


  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    console.log(this.username);  
    
    this.ProfileService.get_user_profile(this.username).subscribe(
      (data: any) => {

        this.profile_user = data.profile;

        // this.jobs = data.profile.products
        this.jobs = data.profile.jobs
        this.followers = data.profile.followers
        this.follows = data.profile.follows
        console.log(data.profile.favouriteJobs);
        this.favouriteJobs = data.profile.favouriteJobs.map((job: Job) => {
          return {
              ...job,
              favorited: true, 
              favouritesCount: job.favoritesCount 
          };
      });

        console.log('Profile User:', this.profile_user);
        console.log(data.profile);
        console.log(this.follows);
        
    });

    this.route.data.pipe(
      concatMap((data: any) => {
        this.profile = data.profile;
        console.log(this.profile);
        // Load the current user's data.
        return this.userService.currentUser.pipe(tap(
          (userData: User) => {
            this.currentUser = userData;
            this.isUser = (this.currentUser.username === this.profile.username);
          }
        ));
      })
    ).subscribe((() => {
      this.cd.markForCheck();
    }));
  }

  onToggleFollowing(following: boolean) {
    this.profile.following = following;
  }

  change_followers(){
    this.pages_profile = "followers";
  }
  change_follows(){
    this.pages_profile = "follows";
  }
  change_products(){
    this.pages_profile = "jobs";
  }

  change_favorites(){
    this.pages_profile = "favorites";
  }
}