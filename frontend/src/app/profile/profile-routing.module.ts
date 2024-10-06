import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileResolver } from './profile-resolver.service';

const routes: Routes = [
  {
    path: ':username',
    component: ProfileComponent,
    resolve: {
      profile: ProfileResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
