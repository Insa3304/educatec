import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategorieService } from '../service/categorie.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categorie-delete',
  templateUrl: './categorie-delete.component.html',
  styleUrls: ['./categorie-delete.component.scss']
})
export class CategorieDeleteComponent implements OnInit {

  @Input() categorie: any;
  @Output() CategorieD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public categorieService: CategorieService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;
  }

  delete() {
    this.categorieService.deleteCategorie(this.categorie.id).subscribe((resp: any) => {
      // Emite el evento y cierra el modal
      this.CategorieD.emit("");
      this.toastr.success("La categoría se eliminó correctamente", "Éxito");
      this.modal.dismiss();
    }, (error) => {
      this.toastr.error("No se pudo eliminar la categoría", "Error");
    });
  }
}
