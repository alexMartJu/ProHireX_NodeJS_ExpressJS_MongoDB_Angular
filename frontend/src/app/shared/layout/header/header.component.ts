import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { User} from '../../../core/models/auth.model';
import { UserService} from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  logged!: Boolean;

  constructor(private userService: UserService,
  private cd: ChangeDetectorRef,
  private router: Router) { }

  currentUser!: User;

  ngOnInit(): void { 
    this.userService.isAuthenticated.subscribe(
      (data) => {
        this.logged = data;
        // console.log(data);
        // console.log(this.logged);
        // this.cd.markForCheck();
      }
    );
    this.userService.currentUser.subscribe(
      (userData) => {
        // console.log(userData);
        this.currentUser = userData;
        // console.log(this.currentUser);
        
        this.cd.markForCheck();
      }
    );
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }
}
