import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../../../service/course.service';

@Component({
  selector: 'app-clase-file-delete',
  templateUrl: './clase-file-delete.component.html',
  styleUrls: ['./clase-file-delete.component.scss']
})
export class ClaseFileDeleteComponent implements OnInit {

  @Input() file_selected: any;
  @Output() FileD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public courseService: CourseService,
    private toastr: ToastrService, 
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
  }

  delete() {
    this.courseService.deleteClaseFile(this.file_selected.id).subscribe((resp: any) => {
     
      this.toastr.success('El archivo ha sido eliminado correctamente', 'Éxito');
      this.FileD.emit("");
      this.modal.dismiss();
    }, (error: any) => {
     
      this.toastr.error('Ocurrió un error al eliminar el archivo', 'Error');
    });
  }
}
