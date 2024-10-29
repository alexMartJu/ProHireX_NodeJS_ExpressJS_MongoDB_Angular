import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPrismaComponent } from './dashboard-prisma.component';
import { DashboardListJobsComponent } from './dashboard-list-jobs.component';
import { DashboardCreateJobComponent } from './dashboard-create-job.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPrismaComponent,
    children: [
      { path: 'dashboard-list-jobs', component: DashboardListJobsComponent },
      { path: 'dashboard-create-jobs', component: DashboardCreateJobComponent },
      { path: '', redirectTo: 'dashboard-list-jobs', pathMatch: 'full' }, // Ruta por defecto
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPrismaRoutingModule { }
