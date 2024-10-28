import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserEnterprise, UserEnterpriseService } from '../../../../core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-user-enterprise',
  templateUrl: './header-user-enterprise.component.html',
  styleUrl: './header-user-enterprise.component.css'
})
export class HeaderUserEnterpriseComponent implements OnInit {

  logged!: Boolean;

  constructor(private userEnterpriseService: UserEnterpriseService,
    private cd: ChangeDetectorRef,
    private router: Router) { }
  
  currentUser!: UserEnterprise;

  ngOnInit(): void {
    this.userEnterpriseService.isAuthenticated.subscribe(
      (data) => {
        this.logged = data;
        // console.log(data);
        // console.log(this.logged);
        // this.cd.markForCheck();
      }
    );
    this.userEnterpriseService.currentUser.subscribe(
      (userData) => {
        // console.log(userData);
        this.currentUser = userData;
        // console.log(this.currentUser);
        
        this.cd.markForCheck();
      }
    );
  }

  logout() {
    this.userEnterpriseService.purgeAuth();
    this.router.navigateByUrl('/');
  }
}