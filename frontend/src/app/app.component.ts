import { Component } from '@angular/core';
import { UserService, UserEnterpriseService, UserAdminService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  isCompanyUser = false;
  isLoading = true;
  isAdminUser = false;

  constructor(private userService: UserService,
    private userEnterpriseService: UserEnterpriseService,
    private userAdminService: UserAdminService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userService.populate();
    this.userEnterpriseService.populate();
    this.userAdminService.populate();
    // Usamos un contador para saber cuándo todos los estados han sido evaluados
  let completedRequests = 0;
    this.userEnterpriseService.isAuthenticated.subscribe(isAuthenticated => {
      this.isCompanyUser = isAuthenticated;
      completedRequests++;
      if (completedRequests === 2) {
        this.isLoading = false;
      }
      console.log(this.isCompanyUser);
    });
    this.userAdminService.isAuthenticated.subscribe(isAuthenticated => {
      this.isAdminUser = isAuthenticated;
      completedRequests++;
      if (completedRequests === 2) {
        this.isLoading = false;
      }
    });
  };
}
