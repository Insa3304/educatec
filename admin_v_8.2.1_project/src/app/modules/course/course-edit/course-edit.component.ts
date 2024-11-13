import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../service/course.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  subcategories: any = [];
  subcategories_back: any = [];
  categories: any = [];
  instructores: any = [];

  isLoading: any;
  FILE_PORTADA: any = null;
  IMAGEN_PREVISUALIZA: any = null;

  title: string = '';
  subtitle: string = '';
  precio_usd: number = 0;
  precio_pen: number = 0;
  description: any = "<p>Hello, world!</p>";
  categorie_id: any = null;
  sub_categorie_id: any = null;
  user_id: any = null;
  state: any = 1;

  courses_id: any;
  course_selected: any = null;
  video_curso: any = null;
  link_video_course: any = null;

  isUploadVideo: Boolean = false;

  constructor(
    public courseService: CourseService,
    private toastr: ToastrService,
    public activedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    
    this.isLoading = this.courseService.isLoading$;
    this.courseService.lisConfig().subscribe((resp: any) => {
      this.subcategories = resp.subcategories;
      this.categories = resp.categories;
      this.instructores = resp.instructores;
      this.showCourse(this.courses_id);
      
    });

    this.activedRoute.params.subscribe((resp: any) => {
      this.courses_id = resp.id;
    });
  }

   showCourse(course_id: string) {
    this.courseService.showCourse(course_id).subscribe((resp: any) => {
      this.course_selected = resp.course;
      this.title = this.course_selected.title;
      this.subtitle = this.course_selected.subtitle;
      this.precio_pen = this.course_selected.precio_pen;
      
      this.categorie_id = this.course_selected.categorie_id;
      this.selectCategorie({ target: { value: this.categorie_id } });
      this.sub_categorie_id = this.course_selected.sub_categorie_id;
      this.description = this.course_selected.description;
      this.user_id = this.course_selected.user_id;
      this.IMAGEN_PREVISUALIZA = this.course_selected.imagen;
      this.state = this.course_selected.state;

      if (this.course_selected.vimeo_id) {
        this.link_video_course = "https://player.vimeo.com/video/" + this.course_selected.vimeo_id;
      }
    });
  }
    
    

  selectCategorie(event: any) {
    let VALUE = event.target.value;
    this.subcategories_back = this.subcategories.filter((item: any) => item.categorie_id == VALUE);
  }

  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  save() {
    if (!this.title || !this.subtitle || !this.precio_pen || !this.categorie_id || !this.sub_categorie_id) {
      this.toastr.error("Necesitas llenar todos los campos del formulario", "Validación");
      return;
    }

    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("subtitle", this.subtitle);
    formData.append("precio_pen", this.precio_pen + "");
    formData.append("categorie_id", this.categorie_id);
    formData.append("sub_categorie_id", this.sub_categorie_id);
    formData.append("description", this.description);
    formData.append("user_id", this.user_id);
    formData.append("state", this.state);
    if (this.FILE_PORTADA) {
      formData.append("portada", this.FILE_PORTADA);
    }

    this.courseService.updateCourses(formData, this.courses_id).subscribe((resp: any) => {
      if (resp.message === 403) {
        this.toastr.error(resp.message_text, "Validación");
        return;
      } else {
        this.toastr.success("El curso se ha modificado con éxito", "Éxito");
      }
    });
  }

  uploadVideo() {
    let formData = new FormData();
    formData.append("video", this.video_curso);
    this.isUploadVideo = true;
    this.courseService.uploadVideo(formData, this.courses_id).subscribe((resp: any) => {
      this.isUploadVideo = false;
      this.link_video_course = resp.link_video;
      this.toastr.success("Video subido exitosamente", "Éxito");
    });
  }

  urlVideo() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link_video_course);
  }

  processVideo($event: any) {
    if ($event.target.files[0].type.indexOf("video") < 0) {
      this.toastr.error('Solamente se aceptan videos', 'Mensaje de Validación');
      return;
    }
    this.video_curso = $event.target.files[0];
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toastr.error('Solamente se aceptan imágenes', 'Mensaje de Validación');
      return;
    }

    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;

    this.courseService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.courseService.isLoadingSubject.next(false);
    }, 50);
  }
}
