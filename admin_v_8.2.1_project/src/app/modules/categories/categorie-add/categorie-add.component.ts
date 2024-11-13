import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategorieService } from '../service/categorie.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-categorie-add',
  templateUrl: './categorie-add.component.html',
  styleUrls: ['./categorie-add.component.scss']
})
export class CategorieAddComponent implements OnInit {


  @Output() CategorieC: EventEmitter<any> = new EventEmitter();
  @Input() CATEGORIES: any = null;


  name: any = null;
  IMAGEN_PREVISUALIZA: any = "./assets/media/avatars/300-6.jpg";
  FILE_PORTADA: any = null;


  isLoading: any;
  selected_option: any = 1;
  categorie_id: any = null;


  constructor(
    public categorieService: CategorieService,
    private toastr: ToastrService, // Cambiado a ToastrService
    public modal: NgbActiveModal,
  ) { }


  ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;
  }


  processAvatar($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toastr.error('SOLAMENTE SE ACEPTAN IMÁGENES', 'MENSAJE DE VALIDACIÓN'); // Cambiado a toastr.error
      return;
    }
    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
  }


  store() {
    if (this.selected_option == 1) { // CREACIÓN DE CATEGORIA
      if (!this.name || !this.FILE_PORTADA) {
        this.toastr.error("NECESITAS LLENAR TODOS LOS CAMPOS", 'VALIDACIÓN'); // Cambiado a toastr.error
        return;
      }
    }
    if (this.selected_option == 2) { // CREACIÓN DE SUBCATEGORIA
      if (!this.name || !this.categorie_id) {
        this.toastr.error("NECESITAS LLENAR TODOS LOS CAMPOS", 'VALIDACIÓN'); // Cambiado a toastr.error
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


    this.categorieService.registerCategorie(formData).subscribe((resp: any) => {
      console.log(resp);
      this.CategorieC.emit(resp.categorie);
      this.toastr.success("LA CATEGORÍA SE REGISTRÓ CORRECTAMENTE", "INFORME"); // Cambiado a toastr.success
      this.modal.close();
    });
  }


  selectedOption(value: number) {
    this.selected_option = value;
  }
}




