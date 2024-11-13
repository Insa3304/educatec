import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionEditComponent } from '../section-edit/section-edit.component';
import { SectionDeleteComponent } from '../section-delete/section-delete.component';

@Component({
  selector: 'app-section-add',
  templateUrl: './section-add.component.html',
  styleUrls: ['./section-add.component.scss']
})
export class SectionAddComponent implements OnInit {

  course_id: any;
  isLoading: any;
  title: any;
  SECTIONS: any = [];

  constructor(
    public courseService: CourseService,
    public activedrouter: ActivatedRoute,
    private toastr: ToastrService,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.activedrouter.params.subscribe((resp: any) => {
      this.course_id = resp.id;
    });

    this.courseService.lisSections(this.course_id).subscribe((resp: any) => {
      this.SECTIONS = resp.sections;
    });
  }

  editSection(SECTION: any) {
    const modalref = this.modalService.open(SectionEditComponent, { centered: true, size: 'md' });
    modalref.componentInstance.section_selected = SECTION;

    modalref.componentInstance.SectionE.subscribe((newSection: any) => {
      let INDEX = this.SECTIONS.findIndex((item: any) => item.id == newSection.id);
      if (INDEX != -1) {
        this.SECTIONS[INDEX] = newSection;
      }
    });
  }

  deleteSection(SECTION: any) {
    const modalref = this.modalService.open(SectionDeleteComponent, { centered: true, size: 'md' });
    modalref.componentInstance.section_selected = SECTION;

    modalref.componentInstance.SectionD.subscribe((newSection: any) => {
      let INDEX = this.SECTIONS.findIndex((item: any) => item.id == SECTION.id);
      if (INDEX != -1) {
        this.SECTIONS.splice(INDEX, 1);
      }
    });
  }

  save() {
    if (!this.title) {
      this.toastr.error("Necesitas ingresar un nombre de la sección", "Validación");
      return;
    }

    let data = {
      name: this.title,
      course_id: this.course_id,
      state: 1,
    };

    this.courseService.registerSection(data).subscribe((resp: any) => {
      this.title = null;
      this.SECTIONS.push(resp.section);
      this.toastr.success("La sección se registró correctamente", "Éxito");
    });
  }
}
