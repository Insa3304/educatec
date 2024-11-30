import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {

  subcategories: any = [];
  subcategories_back: any = [];
  categories: any = [];
  instructores: any = [];

  isLoading: any;
  FILE_PORTADA: any = null;
  IMAGEN_PREVISUALIZA: any = null;

  title: string = '';
  subtitle: string = '';
  precio: number = 0;
  description: any = "<p>Hello, world!</p>";
  categorie_id: any = null;
  sub_categorie_id: any = null;
  user_id: any = null;

  constructor(
    public courseService: CourseService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.courseService.lisConfig().subscribe((resp: any) => {
      console.log(resp);
      this.subcategories = resp.subcategories;
      this.categories = resp.categories;
      this.instructores = resp.instructores;
    });
  }

  selectCategorie(event: any) {
    const VALUE = event.target.value;
    this.subcategories_back = this.subcategories.filter((item: any) => item.categorie_id == VALUE);
  }

  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  save() {
    if (!this.title || !this.subtitle || !this.precio || !this.categorie_id || !this.sub_categorie_id || !this.description) {
      this.toastr.error("Necesitas llenar todos los campos del formulario", "Atención");
      return;
    }

    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("subtitle", this.subtitle);
    formData.append("precio", this.precio + "");
    formData.append("categorie_id", this.categorie_id);
    formData.append("sub_categorie_id", this.sub_categorie_id);
    formData.append("description", this.description);
    formData.append("user_id", this.user_id);
    formData.append("portada", this.FILE_PORTADA);

    this.courseService.registerCourses(formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message === 403) {
        this.toastr.error(resp.message_text, "Validación");
        return;
      } else {
        this.toastr.success("El curso se ha creado con éxito", "Éxito");
        this.title = '';
        this.subtitle = '';
        this.precio = 0;
        this.categorie_id = null;
        this.sub_categorie_id = null;
        this.description = null;
        this.user_id = null;
        this.FILE_PORTADA = null;
        this.IMAGEN_PREVISUALIZA = null;
      }
    });
  }

  
   
  

  processFile($event: any) {
    const file = $event.target.files?.[0];
    if (!file || file.type.indexOf("image") < 0) {
      this.toastr.error('Solamente se aceptan imágenes', 'Mensaje de Validación');
      return;
    }

    this.FILE_PORTADA = file;
    const reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;

    this.courseService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.courseService.isLoadingSubject.next(false);
    }, 50);
  }
}
