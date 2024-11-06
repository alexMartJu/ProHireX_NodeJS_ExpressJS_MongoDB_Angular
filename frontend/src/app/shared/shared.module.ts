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
import { FollowListComponent } from './follow-list/follow-list.component';
import { ListJobsOnProfileComponent } from './list-jobs-on-profile/list-jobs-on-profile.component';
import { ListFavJobsProfileComponent } from './list-fav-jobs-profile/list-fav-jobs-profile.component';
import { ListErrorsComponent } from './list-errors/list-errors.component';
import { JobItemDashboardComponent } from './components_Prisma/job-item-dashboard/job-item-dashboard.component';
import { ListJobPendingDashboardComponent } from './components_TypeORM/list-job-pending-dashboard/list-job-pending-dashboard.component';
import { ListApplicationPendingDashboardComponent } from './components_TypeORM/list-application-pending-dashboard/list-application-pending-dashboard.component';


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
    FollowButtonComponent,
    FollowListComponent,
    ListJobsOnProfileComponent,
    ListFavJobsProfileComponent,
    ListErrorsComponent,
    JobItemDashboardComponent,
    ListJobPendingDashboardComponent,
    ListApplicationPendingDashboardComponent
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
      FollowButtonComponent,
      FollowListComponent,
      ListJobsOnProfileComponent,
      ListFavJobsProfileComponent,
      ListErrorsComponent,
      JobItemDashboardComponent,
      ListJobPendingDashboardComponent,
      ListApplicationPendingDashboardComponent
  ],
})
export class SharedModule { }
