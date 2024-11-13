import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategorieService } from '../service/categorie.service';

@Component({
  selector: 'app-categorie-edit',
  templateUrl: './categorie-edit.component.html',
  styleUrls: ['./categorie-edit.component.scss']
})
export class CategorieEditComponent implements OnInit {

  @Output() CategorieE: EventEmitter<any> = new EventEmitter();
  @Input() CATEGORIES: any = null;
  @Input() categorie: any = null;

  name: any = null;
  IMAGEN_PREVISUALIZA: any = "./assets/media/avatars/300-6.jpg";
  FILE_PORTADA: any = null;

  isLoading: any;
  selected_option: any = 1;
  categorie_id: any = null;
  state: any = 1;

  constructor(
    public categorieService: CategorieService,
    public toastr: ToastrService,
    public modal: NgbActiveModal
  ) { }
 

  ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;
    this.name = this.categorie.name;
    this.selected_option = this.categorie.categorie_id ? 2 : 1;
    this.IMAGEN_PREVISUALIZA = this.categorie.imagen ? this.categorie.imagen : "./assets/media/avatars/300-6.jpg";
    this.categorie_id = this.categorie.categorie_id ? Number(this.categorie.categorie_id) : null;
    this.state = this.categorie.state;

  
  }

  processAvatar($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toastr.error('SOLAMENTE SE ACEPTAN IMÁGENES', 'MENSAJE DE VALIDACIÓN');
      return;
    }
    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
  }

  store() {
    if (this.selected_option === 1) { // CREACIÓN DE CATEGORÍA
      if (!this.name) {
        this.toastr.error("NECESITAS LLENAR TODOS LOS CAMPOS", 'VALIDACIÓN');
        return;
      }
    }

    if (this.selected_option === 2) { // CREACIÓN DE SUBCATEGORÍA
      if (!this.name || !this.categorie_id) {
        this.toastr.error("NECESITAS LLENAR TODOS LOS CAMPOS", 'VALIDACIÓN');
        return;
      }
    }

    let formData = new FormData();
    formData.append("name", this.name);

    if (this.categorie_id) {
      formData.append("categorie_id", this.categorie_id);
    }

    if (this.FILE_PORTADA) {
      formData.append("portada", this.FILE_PORTADA);
    }

    formData.append("state", this.state);

    this.categorieService.updateCategorie(formData, this.categorie.id).subscribe(
      (resp: any) => {
        console.log(resp);
        this.CategorieE.emit(resp.categorie);
        this.toastr.success("LA CATEGORÍA SE ACTUALIZÓ CORRECTAMENTE", "INFORME");
        this.modal.close();
      },
      (error) => {
        console.error(error);
        this.toastr.error("OCURRIÓ UN ERROR AL ACTUALIZAR LA CATEGORÍA", "ERROR");
      }
    );
  }

  selectedOption(value: number) {
    this.selected_option = value;
  }
}
