import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardTypeORMRoutingModule } from './dashboard-type-orm-routing.module';
import { DashboardTypeOrmComponent } from './dashboard-type-orm.component';
import { DashboardSidebarTypeOrmComponent } from './dashboard-sidebar-type-orm.component';
import { DashboardListPendingJobsComponent } from './dashboard-list-pending-jobs.component';
import { DashboardListIncriptionJobsComponent } from './dashboard-list-incription-jobs.component';


@NgModule({
  declarations: [
    DashboardTypeOrmComponent,
    DashboardSidebarTypeOrmComponent,
    DashboardListPendingJobsComponent,
    DashboardListIncriptionJobsComponent
  ],
  imports: [
    CommonModule,
    DashboardTypeORMRoutingModule
  ]
})
export class DashboardTypeORMModule { }
