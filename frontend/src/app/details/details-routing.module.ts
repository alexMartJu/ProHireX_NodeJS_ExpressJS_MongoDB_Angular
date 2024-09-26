import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './details.component';
import { DetailsResolverService } from './details-resolver.service';

const routes: Routes = [
  {
    path: ':slug',
    component: DetailsComponent,
    resolve: {job: DetailsResolverService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsRoutingModule { }
