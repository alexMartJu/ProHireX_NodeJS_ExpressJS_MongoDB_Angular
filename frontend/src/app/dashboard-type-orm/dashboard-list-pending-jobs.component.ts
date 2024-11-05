import { Component, OnInit } from '@angular/core';
import { ApiTypeORMService } from '../core';
import { Job } from '../core';

@Component({
  selector: 'app-dashboard-list-pending-jobs',
  templateUrl: './dashboard-list-pending-jobs.component.html',
  styleUrl: './dashboard-list-pending-jobs.component.css'
})
export class DashboardListPendingJobsComponent implements OnInit {
  pendingJobs: Job[] = [];

  constructor(private apiTypeORMService: ApiTypeORMService) { }

  ngOnInit(): void {
    this.loadPendingJobs();
  }

  // Método para cargar los trabajos pendientes desde el servicio
  private loadPendingJobs(): void {
    this.apiTypeORMService.get('/api/admin/listJobs').subscribe(
      (jobs: Job[]) => {
        this.pendingJobs = jobs.filter(job => job.state === 'pending'); // Filtra solo los trabajos pendientes
      },
      error => {
        console.error('Error fetching pending jobs:', error);
      }
    );
  }

  onAccept(slug: string): void {
    console.log('Accepted job:', slug);
    this.apiTypeORMService.post('/api/admin/respond', { slug, response: 'accept' }).subscribe(
      response => {
        console.log('Accepted job:', response);
        this.removeJobFromList(slug);
      },
      error => {
        console.error('Error accepting job:', error);
      }
    );
  }

  onReject(slug: string): void {
    console.log('Rejected job:', slug);
    this.apiTypeORMService.post('/api/admin/respond', { slug, response: 'reject' }).subscribe(
      response => {
        console.log('Rejected job:', response);
        this.removeJobFromList(slug);
      },
      error => {
        console.error('Error rejecting job:', error);
      }
    );
  }

  private removeJobFromList(slug: string): void {
    // Filtra la lista de trabajos para eliminar el trabajo específico
    this.pendingJobs = this.pendingJobs.filter(job => job.slug !== slug);
  }
}