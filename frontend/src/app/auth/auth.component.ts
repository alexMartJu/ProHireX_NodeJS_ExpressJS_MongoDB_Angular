import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/auth.service';
import Swal from 'sweetalert2';
import { Errors } from '../core';
import { UserEnterpriseService } from '../core/services_Prisma/auth-enterprise.service';

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
  errors: Errors = {errors: {}};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private userEnterpriseService: UserEnterpriseService
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'checkboxEnterprise': [false]
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
    this.errors = { errors: {} };
  
    const credentials = this.authForm.value;
    const checkboxEnterprise = this.authForm.get('checkboxEnterprise')?.value; // Obtiene el valor del checkbox
  
    console.log(this.authType);
  
    if (this.authType === 'register') {
      // Lógica para registro
      this.userService.attemptAuth(this.authType, credentials).subscribe(
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
          this.errors = { errors: { Error: err.message } };
          this.isSubmitting = false;
          this.cd.markForCheck();
        }
      );
    } else if (this.authType === 'login') {
      // Si el checkbox NO está marcado, utiliza userService
      if (!checkboxEnterprise) {
        this.userService.attemptAuth(this.authType, credentials).subscribe(
          data => {
            Swal.fire({
              title: '¡Inicio de sesión exitoso!',
              text: 'Has iniciado sesión correctamente.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigateByUrl('/');  // Redirige a la página principal después del login
            });
          },
          err => {
            console.log('Error recibido:', err);
            this.errors = { errors: { Error: err.message } };
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        );
      } else {
        // Si el checkbox está marcado, utiliza userPrismaService
        this.userEnterpriseService.attemptAuth(this.authType, credentials).subscribe(
          data => {
            Swal.fire({
              title: '¡Inicio de sesión exitoso!',
              text: 'Has iniciado sesión correctamente.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigateByUrl('/dashboard_Prisma');  // Redirige al dashboard después del login
            });
          },
          err => {
            console.log('Error recibido:', err);
            this.errors = { errors: { Error: err.message } };
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        );
      }
    }
  }
  
}