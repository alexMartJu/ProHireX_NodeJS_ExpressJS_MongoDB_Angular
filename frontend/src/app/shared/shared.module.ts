import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { CardCategoryComponent } from './card-category/card-category.component';
import { ListJobsComponent } from './list-jobs/list-jobs.component';
import { CardJobComponent } from './card-job/card-job.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselItemsComponent } from './carousel-items/carousel-items.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { FiltersComponent } from './filters/filters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { FavoriteButtonComponent } from './buttons/favorite-button.component';
import { FollowButtonComponent } from './buttons/follow-button.component';


@NgModule({
  declarations: [
    ListCategoriesComponent,
    CardCategoryComponent,
    ListJobsComponent,
    CardJobComponent,
    CarouselComponent,
    CarouselItemsComponent,
    FiltersComponent,
    SearchComponent,
    FavoriteButtonComponent,
    FollowButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
      ListCategoriesComponent,
      CardCategoryComponent,
      ListJobsComponent,
      CardJobComponent,
      CarouselComponent,
      FiltersComponent,
      SearchComponent,
      ReactiveFormsModule,
      FavoriteButtonComponent,
      FollowButtonComponent
  ],
})
export class SharedModule { }
