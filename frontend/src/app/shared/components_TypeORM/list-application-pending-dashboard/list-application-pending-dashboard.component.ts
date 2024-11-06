import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '../../../core';

@Component({
  selector: 'app-list-application-pending-dashboard',
  templateUrl: './list-application-pending-dashboard.component.html',
  styleUrl: './list-application-pending-dashboard.component.css'
})
export class ListApplicationPendingDashboardComponent {

  @Input() application!: Application; // Recibe la aplicación como input
  @Output() updateStatus = new EventEmitter<{ applicationSlug: string; status: string }>(); // Emite el estado actualizado

  onAccept(): void {
    this.updateStatus.emit({ applicationSlug: this.application.applicationSlug, status: 'accepted' });
  }

  onReject(): void {
    this.updateStatus.emit({ applicationSlug: this.application.applicationSlug, status: 'rejected' });
  }
}