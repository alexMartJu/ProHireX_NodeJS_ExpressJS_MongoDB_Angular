import { Component } from '@angular/core';
import { UserService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.populate();
  };
}
