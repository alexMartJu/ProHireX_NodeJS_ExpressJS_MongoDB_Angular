import { Component, Input, OnInit } from '@angular/core';
import { Job } from '../../core/models/job.model';
import { ApiService } from '../../core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-job',
  templateUrl: './card-job.component.html',
  styleUrl: './card-job.component.css'
})
export class CardJobComponent implements OnInit {

  @Input() job: Job = {} as Job;
  hasApplied: boolean = false;

  constructor(private apiService: ApiService,
    private router: Router) { }

  ngOnInit(): void {this.checkIfApplied();}

  onToggleFavorite(favorited: boolean) {
    this.job.favorited = favorited;

    if (favorited) {
      this.job.favoritesCount++;
    } else {
      this.job.favoritesCount--;
    }
  }

  // Método para aplicar a la oferta
  applyToJob() {
    const slug = this.job.slug; // Obtenemos el slug de la oferta

    // Aquí hacemos la llamada a la API para aplicar a la oferta
    this.apiService.post('/apply', { slug }).subscribe(
      response => {
        console.log('Solicitud de aplicación procesada:', response);
        this.hasApplied = true;
        Swal.fire({
          title: '¡Éxito!',
          text: 'Te has postulado a la oferta con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error => {
        console.error('Error al aplicar a la oferta:', error);
        this.router.navigateByUrl('/auth/login');
      }
    );
  }

  // Método para verificar si el usuario ya se ha postulado
  checkIfApplied() {
    console.log("entro checkif");
    const slug = this.job.slug; // Obtenemos el slug del trabajo
    console.log(slug);

    this.apiService.get(`/hasUserApplied/ch?slug=${slug}`).subscribe(
      (response) => {
        this.hasApplied = response.applied; // Asigna el estado de la aplicación
      },
      (error) => {
        console.error('Error al verificar el estado de la aplicación:', error);
        // Maneja el error según sea necesario
      }
    );
  }
}