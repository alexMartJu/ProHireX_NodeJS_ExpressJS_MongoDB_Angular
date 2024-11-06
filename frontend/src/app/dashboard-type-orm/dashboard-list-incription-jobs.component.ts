import { Component, OnInit } from '@angular/core';
import { ApiTypeORMService } from '../core';
import { Application } from '../core';

@Component({
  selector: 'app-dashboard-list-incription-jobs',
  templateUrl: './dashboard-list-incription-jobs.component.html',
  styleUrl: './dashboard-list-incription-jobs.component.css'
})
export class DashboardListIncriptionJobsComponent implements OnInit {
  pendingApplications: Application[] = [];

  constructor(private apiTypeORMService: ApiTypeORMService) {}

  ngOnInit(): void {
    this.fetchPendingApplications();
  }

  fetchPendingApplications(): void {
    this.apiTypeORMService.get('/api/application/pending/applications').subscribe(
      (data:Application[]) => {
        this.pendingApplications = data;
      },
      (error) => {
        console.error("Error fetching pending applications:", error);
      }
    );
  }

  respondToApplication(applicationSlug: string, status: string): void {
    console.log("applicationSlug", applicationSlug);
    // Lógica para actualizar el estado de la aplicación
    this.apiTypeORMService.post('/api/application/respond', { applicationSlug, status }).subscribe(
      () => {
        // Si la actualización es exitosa, puedes volver a obtener la lista de aplicaciones pendientes
        this.fetchPendingApplications(); // Esto recargará la lista de aplicaciones
      },
      (error) => {
        console.error("Error updating application status:", error);
      }
    );
  }
}