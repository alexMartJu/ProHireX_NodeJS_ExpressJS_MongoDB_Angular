import { Component, Input } from '@angular/core';
import { Job } from '../../../core';

// Definir un tipo literal para los estados permitidos en los trabajos
// Esto permite restringir los valores posibles de los estados a estos cuatro valores específicos
type JobStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

@Component({
  selector: 'app-job-item-dashboard',
  templateUrl: './job-item-dashboard.component.html',
  styleUrl: './job-item-dashboard.component.css'
})
export class JobItemDashboardComponent {
  @Input() job!: Job;

  // Objeto de traducciones para los diferentes estados del trabajo
  // 'Record<JobStatus, string>' garantiza que las claves solo sean de tipo 'JobStatus'
  private translations: Record<JobStatus, string> = {
    pending: 'Pendiente',
    accepted: 'Aceptado',
    rejected: 'Rechazado',
    completed: 'Completado'
  };

  // Objeto de clases CSS para aplicar estilos diferentes según el estado del trabajo
  // 'Record<JobStatus, string>' asegura que solo se pueden usar estados válidos como claves
  private statusClasses: Record<JobStatus, string> = {
    pending: 'status-pending',
    accepted: 'status-accepted',
    rejected: 'status-rejected',
    completed: 'status-completed'
  };

  // Método para traducir el estado del trabajo a español
  // Toma 'status' como string y lo convierte en tipo 'JobStatus' para buscar en el objeto 'translations'
  // Si no encuentra el estado, devuelve el valor sin traducir como valor predeterminado
  getTranslatedStatus(status: string): string {
    return this.translations[status as JobStatus] || status;
  }

  // Método para obtener la clase CSS asociada al estado del trabajo
  // Toma 'status' como string y lo convierte en tipo 'JobStatus' para buscar en el objeto 'statusClasses'
  // Si no encuentra el estado, devuelve una cadena vacía como valor predeterminado
  getStatusClass(status: string): string {
    return this.statusClasses[status as JobStatus] || '';
  }
}