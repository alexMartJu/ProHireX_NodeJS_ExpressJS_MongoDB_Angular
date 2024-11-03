import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/auth.service';
import Swal from 'sweetalert2';
import { Errors } from '../core';
import { UserEnterpriseService } from '../core/services_Prisma/auth-enterprise.service';
import { UserAdminService } from '../core/services_TypeORM';

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
    private userEnterpriseService: UserEnterpriseService,
    private userAdminService: UserAdminService
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'checkboxEnterprise': [false],
      'checkboxAdmin': [false]
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

  toggleCheckbox(type: string) {
    if (type === 'enterprise') {
      // Deshabilita el checkbox de Admin si el de Empresa está marcado y viceversa
      if (this.authForm.get('checkboxEnterprise')?.value) {
        this.authForm.get('checkboxAdmin')?.setValue(false);
        this.authForm.get('checkboxAdmin')?.disable();
      } else {
        this.authForm.get('checkboxAdmin')?.enable();
      }
    } else if (type === 'admin') {
      // Deshabilita el checkbox de Empresa si el de Admin está marcado y viceversa
      if (this.authForm.get('checkboxAdmin')?.value) {
        this.authForm.get('checkboxEnterprise')?.setValue(false);
        this.authForm.get('checkboxEnterprise')?.disable();
      } else {
        this.authForm.get('checkboxEnterprise')?.enable();
      }
    }
  }
  
  submitForm() {
    this.isSubmitting = true;
    this.errors = { errors: {} };

    const credentials = this.authForm.value;
    const checkboxEnterprise = this.authForm.get('checkboxEnterprise')?.value;
    const checkboxAdmin = this.authForm.get('checkboxAdmin')?.value;

    if (this.authType === 'register') {
      this.userService.attemptAuth(this.authType, credentials).subscribe(
        data => {
          Swal.fire({
            title: '¡Registro exitoso!',
            text: 'Te has registrado correctamente. Ahora puedes iniciar sesión.',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false 
          }).then(() => {
            this.router.navigateByUrl('/auth/login');
          });
        },
        err => {
          this.errors = { errors: { Error: err.message } };
          this.isSubmitting = false;
          this.cd.markForCheck();
        }
      );
    } else if (this.authType === 'login') {
      if (checkboxEnterprise  && !checkboxAdmin) {
        this.userEnterpriseService.attemptAuth(this.authType, credentials).subscribe(
          data => {
            Swal.fire({
              title: '¡Inicio de sesión exitoso!',
              text: 'Has iniciado sesión correctamente como Empresa.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigateByUrl('/dashboard_Prisma');
            });
          },
          err => {
            this.errors = { errors: { Error: err.message } };
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        );
      } else if (checkboxAdmin && !checkboxEnterprise) {
        this.userAdminService.attemptAuth(this.authType, credentials).subscribe(
          data => {
            Swal.fire({
              title: '¡Inicio de sesión exitoso!',
              text: 'Has iniciado sesión correctamente como Admin.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigateByUrl('/dashboard_TypeORM');  // Cambia la ruta según corresponda
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
        this.userService.attemptAuth(this.authType, credentials).subscribe(
          data => {
            Swal.fire({
              title: '¡Inicio de sesión exitoso!',
              text: 'Has iniciado sesión correctamente.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigateByUrl('/');
            });
          },
          err => {
            this.errors = { errors: { Error: err.message } };
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        );
      }
    }
  }
  
}