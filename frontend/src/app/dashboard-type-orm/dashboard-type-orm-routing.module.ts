import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardTypeOrmComponent } from './dashboard-type-orm.component';
import { DashboardListPendingJobsComponent } from './dashboard-list-pending-jobs.component';
import { DashboardListIncriptionJobsComponent } from './dashboard-list-incription-jobs.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardTypeOrmComponent,
    children: [
      { path: 'dashboard-list-pending-jobs', component: DashboardListPendingJobsComponent },
      { path: 'dashboard-list-incription-jobs', component: DashboardListIncriptionJobsComponent },
      { path: '', redirectTo: 'dashboard-list-pending-jobs', pathMatch: 'full' }, // Ruta por defecto
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardTypeORMRoutingModule { }
