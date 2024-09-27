import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { CardCategoryComponent } from './card-category/card-category.component';
import { ListJobsComponent } from './list-jobs/list-jobs.component';
import { CardJobComponent } from './card-job/card-job.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselItemsComponent } from './carousel-items/carousel-items.component';



@NgModule({
  declarations: [
    ListCategoriesComponent,
    CardCategoryComponent,
    ListJobsComponent,
    CardJobComponent,
    CarouselComponent,
    CarouselItemsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
      ListCategoriesComponent,
      CardCategoryComponent,
      ListJobsComponent,
      CardJobComponent,
      CarouselComponent
  ],
})
export class SharedModule { }
