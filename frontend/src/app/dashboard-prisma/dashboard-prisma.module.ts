import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardPrismaRoutingModule } from './dashboard-prisma-routing.module';
import { DashboardPrismaComponent } from './dashboard-prisma.component';


@NgModule({
  declarations: [
    DashboardPrismaComponent
  ],
  imports: [
    CommonModule,
    DashboardPrismaRoutingModule
  ]
})
export class DashboardPrismaModule { }
