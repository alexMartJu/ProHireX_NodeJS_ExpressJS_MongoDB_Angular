import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../../core';

@Component({
  selector: 'app-list-job-pending-dashboard',
  templateUrl: './list-job-pending-dashboard.component.html',
  styleUrl: './list-job-pending-dashboard.component.css'
})
export class ListJobPendingDashboardComponent {

  @Input() jobs: Job[] = []; // Lista de trabajos que se va a recibir desde el componente padre

  @Output() acceptJob = new EventEmitter<string>(); // Emite el slug cuando se acepta un trabajo
  @Output() rejectJob = new EventEmitter<string>(); // Emite el slug cuando se rechaza un trabajo

  onAccept(slug: string): void {
    console.log('Accepted job:', slug);
    this.acceptJob.emit(slug);
  }

  onReject(slug: string): void {
    this.rejectJob.emit(slug);
  }
}