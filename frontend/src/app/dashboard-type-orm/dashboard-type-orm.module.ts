import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardTypeORMRoutingModule } from './dashboard-type-orm-routing.module';
import { DashboardTypeOrmComponent } from './dashboard-type-orm.component';


@NgModule({
  declarations: [
    DashboardTypeOrmComponent
  ],
  imports: [
    CommonModule,
    DashboardTypeORMRoutingModule
  ]
})
export class DashboardTypeORMModule { }
