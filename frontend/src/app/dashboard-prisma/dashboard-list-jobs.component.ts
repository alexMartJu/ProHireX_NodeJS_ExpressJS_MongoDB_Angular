import { Component, OnInit } from '@angular/core';
import { ApiPrismaService } from '../core';
import { Job } from '../core';

@Component({
  selector: 'app-dashboard-list-jobs',
  templateUrl: './dashboard-list-jobs.component.html',
  styleUrl: './dashboard-list-jobs.component.css'
})
export class DashboardListJobsComponent implements OnInit {
  jobs: Job[] = [];
  constructor(private apiPrismaService: ApiPrismaService) {}

  ngOnInit() {
    this.loadJobs(); // Llama a la función para cargar trabajos al inicializar el componente
  }

  loadJobs() {
    this.apiPrismaService.get('/api/jobs/listjobs') // Reemplaza con tu endpoint
      .subscribe(
        (data) => {
          this.jobs = data; // Almacena los trabajos recibidos
          console.log('Jobs:', this.jobs);
        },
        (error) => {
          console.error('Error loading jobs', error); // Maneja errores de carga
        }
      );
  }
}