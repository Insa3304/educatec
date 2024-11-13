import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-section-delete',
  templateUrl: './section-delete.component.html',
  styleUrls: ['./section-delete.component.scss']
})
export class SectionDeleteComponent implements OnInit {


  @Input() section_selected: any;
  @Output() SectionD: EventEmitter<any> = new EventEmitter();
  isLoading: any;


  constructor(
    public courseService: CourseService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {}


  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
  }


  delete() {
    this.courseService.deleteSection(this.section_selected.id).subscribe((resp: any) => {
      if (resp.message == 403) {
        this.toastr.error(resp.message_text, 'VALIDACIÓN');
        return;
      } else {
        this.toastr.success('Sección eliminada correctamente', 'Éxito');
        this.SectionD.emit("");
        this.modal.dismiss();
      }
    });
  }
}




