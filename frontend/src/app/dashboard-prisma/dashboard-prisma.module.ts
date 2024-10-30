import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardPrismaRoutingModule } from './dashboard-prisma-routing.module';
import { DashboardPrismaComponent } from './dashboard-prisma.component';
import { DashboardSidebarPrismaComponent } from './dashboard-sidebar-prisma.component';
import { DashboardCreateJobComponent } from './dashboard-create-job.component';
import { DashboardListJobsComponent } from './dashboard-list-jobs.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardPrismaComponent,
    DashboardSidebarPrismaComponent,
    DashboardCreateJobComponent,
    DashboardListJobsComponent
  ],
  imports: [
    CommonModule,
    DashboardPrismaRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class DashboardPrismaModule { }
