import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../../../service/course.service';

@Component({
  selector: 'app-clase-delete',
  templateUrl: './clase-delete.component.html',
  styleUrls: ['./clase-delete.component.scss']
})
export class ClaseDeleteComponent implements OnInit {

  @Input() clase_selected: any;
  @Output() ClaseD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public courseService: CourseService,
    private toastr: ToastrService, // Reemplazado por ToastrService
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
  }

  delete() {
    this.courseService.deleteClase(this.clase_selected.id).subscribe({
      next: (resp: any) => {
        this.toastr.success("La clase ha sido eliminada correctamente", "Éxito");
        this.ClaseD.emit("");
        this.modal.dismiss();
      },
      error: (error: any) => {
        this.toastr.error("Ocurrió un error al eliminar la clase", "Error");
      }
    });
  }
}
