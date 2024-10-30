import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiPrismaService } from '../core';
import { Errors } from '../core';

@Component({
  selector: 'app-dashboard-create-job',
  templateUrl: './dashboard-create-job.component.html',
  styleUrls: ['./dashboard-create-job.component.css']
})
export class DashboardCreateJobComponent {
  jobForm: FormGroup;
  errors: Errors = { errors: {} };

  // Referencia a los campos de input para resetear después de enviar
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('singleFileInput') singleFileInput!: ElementRef;

  // Mapa de errores que relaciona los mensajes de error del backend con los controles del formulario.
  errorControlMap: { [key: string]: string } = {
    'El campo id_cat es obligatorio': 'id_cat',
    'El campo nombre es obligatorio': 'name',
    'El precio debe ser un número': 'price',
    'El campo descripción es obligatorio': 'description',
    'El campo img es obligatorio': 'img',
    'El campo nombre de la empresa es obligatorio': 'company_name',
    'El campo imágenes debe ser un array no vacío': 'images',
    'El campo ubicación es obligatorio': 'location',
    'El campo requisitos es obligatorio': 'requirements',
    'La categoría especificada no existe': 'id_cat', // Mapeo para categoría específica
  };

  constructor(
    private fb: FormBuilder,
    private apiPrismaService: ApiPrismaService
  ) {
    this.jobForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      company_name: ['', Validators.required],
      id_cat: ['', Validators.required],
      images: [[], Validators.required], // Campo array para múltiples imágenes
      location: ['', Validators.required],
      requirements: ['', Validators.required],
      img: ['', Validators.required], // Imagen única
    });
  }

  onSubmit() {
    console.log("Form submitted!");
    console.log(this.jobForm.value);

    // Marca todos los campos como "touched" para mostrar mensajes de validación
    this.jobForm.markAllAsTouched();

    // Crear objeto de datos del formulario
    const formData = { ...this.jobForm.value, images: this.jobForm.value.images };

    // Llamada al servicio para enviar los datos
    this.apiPrismaService.post('/api/jobs/createjob', formData).subscribe({
      next: () => {
        console.log('Job created successfully');
        this.errors = { errors: {} };
        this.resetForm();
      },
      error: (err: Errors) => {
        // Maneja los errores devueltos por el backend tras el envío del formulario. 
        // Comprueba si hay errores en "body" y, si es así, itera sobre cada mensaje de error. 
        // Si el mensaje corresponde a un control específico (usando un mapa de errores), 
        // se establece el error en el control correspondiente. Si no, intenta derivar 
        // el nombre del control desde el mensaje de error y lo establece si el control existe.
        console.log("Backend errors received:", err.errors);

        if (err.errors["body"] && Array.isArray(err.errors["body"])) {
          err.errors["body"].forEach((errorMessage: string) => {
            // Manejo de error específico para categoría
            if (this.errorControlMap[errorMessage]) {
              const controlName = this.errorControlMap[errorMessage];
              this.jobForm.get(controlName)?.setErrors({ backend: errorMessage });
            } else {
              // Manejo de errores generales
              const controlName = errorMessage.split(' ')[0].toLowerCase();
              const control = this.jobForm.get(controlName);
              if (control) {
                control.setErrors({ backend: errorMessage });
              }
            }
          });
        }
      }
    });
  }

  // Resetea el formulario y los campos de entrada de archivos
  resetForm() {
    this.jobForm.reset();
    this.jobForm.patchValue({ images: [], img: '' });
    this.fileInput.nativeElement.value = '';
    this.singleFileInput.nativeElement.value = '';
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files; // Obtiene los archivos seleccionados
    const imageArray: string[] = this.jobForm.get('images')?.value || []; // Obtiene el array de imágenes del formulario

    // Recorre cada archivo seleccionado y lo añade al array de imágenes
    Array.from(files).forEach((file: File) => {
      const imagePath = `/img_details/${file.name}`; // Genera la ruta de la imagen
      imageArray.push(imagePath); // Añade la ruta al array
    });

    // Actualiza el valor del formulario con el nuevo array de imágenes
    this.jobForm.patchValue({ images: imageArray });
  }

  onFileChangeSingle(event: any) {
    const file = event.target.files[0];
    if (file) {
      const imagePath = `/img_jobs/${file.name}`;
      this.jobForm.patchValue({ img: imagePath });
    }
  }
}