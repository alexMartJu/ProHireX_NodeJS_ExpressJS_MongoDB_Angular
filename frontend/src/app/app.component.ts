import { Component } from '@angular/core';
import { UserService, UserEnterpriseService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  isCompanyUser = false;
  isLoading = true;

  constructor(private userService: UserService,
    private userEnterpriseService: UserEnterpriseService
  ) {}

  ngOnInit() {
    this.userService.populate();
    this.userEnterpriseService.populate();
    this.userEnterpriseService.isAuthenticated.subscribe(isAuthenticated => {
      this.isCompanyUser = isAuthenticated;
      this.isLoading = false;
      console.log(this.isCompanyUser);
    });
  };
}
