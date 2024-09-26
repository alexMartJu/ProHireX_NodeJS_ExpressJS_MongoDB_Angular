import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { CardCategoryComponent } from './card-category/card-category.component';
import { ListJobsComponent } from './list-jobs/list-jobs.component';
import { CardJobComponent } from './card-job/card-job.component';



@NgModule({
  declarations: [
    ListCategoriesComponent,
    CardCategoryComponent,
    ListJobsComponent,
    CardJobComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
      ListCategoriesComponent,
      CardCategoryComponent,
      ListJobsComponent,
      CardJobComponent
  ],
})
export class SharedModule { }
