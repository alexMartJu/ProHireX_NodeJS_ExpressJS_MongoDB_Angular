import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserAdmin, UserAdminService } from '../../../../core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-user-admin',
  templateUrl: './header-user-admin.component.html',
  styleUrl: './header-user-admin.component.css'
})
export class HeaderUserAdminComponent implements OnInit {

  logged!: Boolean;

  constructor(private userAdminService: UserAdminService,
    private cd: ChangeDetectorRef,
    private router: Router) { }
  
  currentUser!: UserAdmin;

  ngOnInit(): void {
    this.userAdminService.isAuthenticated.subscribe(
      (data) => {
        this.logged = data;
        // console.log(data);
        // console.log(this.logged);
        // this.cd.markForCheck();
      }
    );
    this.userAdminService.currentUser.subscribe(
      (userData) => {
        // console.log(userData);
        this.currentUser = userData;
        // console.log(this.currentUser);
        
        this.cd.markForCheck();
      }
    );
  }

  logout() {
    this.userAdminService.purgeAuth();
    this.router.navigateByUrl('/');
  }

}
