import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  authType: string = '';
  title: String = '';
  isSubmitting = false;
  authForm: FormGroup;
  user!: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a title for the page accordingly
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
      // add form control for username if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl());
      }
      this.cd.markForCheck();
    });
  }

  submitForm() {
    this.isSubmitting = true;
  
    const credentials = this.authForm.value;
    // console.log('Sending credentials:', this.user); 
    console.log(this.authType);
  
    if (this.authType === 'register') {
      // Si está en modo de registro, realiza el registro y redirige al formulario de login
      this.userService
        .attemptAuth(this.authType, credentials)
        .subscribe(
          data => {
            Swal.fire({
              title: '¡Registro exitoso!',
              text: 'Te has registrado correctamente. Ahora puedes iniciar sesión.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false 
            }).then(() => {
              this.router.navigateByUrl('/auth/login');  // Redirige al login después del registro
            });
          },
          err => {
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        );
    } else if (this.authType === 'login') {
      // Si está en modo login, inicia sesión y redirige a la página principal
      this.userService
        .attemptAuth(this.authType, credentials)
        .subscribe(
          data => {
            Swal.fire({
              title: '¡Inicio de sesión exitoso!',
              text: 'Has iniciado sesión correctamente.',
              icon: 'success',
              timer: 3000,  // Se cierra automáticamente después de 3 segundos
              showConfirmButton: false // Oculta el botón de confirmación
            }).then(() => {
              this.router.navigateByUrl('/');  // Redirige a la página principal después del login
            });
          },
          err => {
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        );
    }
  }
}
