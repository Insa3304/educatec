import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../service/course.service';


@Component({
  selector: 'app-course-delete',
  templateUrl: './course-delete.component.html',
  styleUrls: ['./course-delete.component.scss']
})
export class CourseDeleteComponent implements OnInit {


  @Input() course:any;


  @Output() CourseD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public courseService: CourseService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ) { }


  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
  }


  delete(){
    this.courseService.deleteCourses(this.course.id).subscribe((resp:any) => {
      // console.log(resp)
      this.CourseD.emit("");
      this.toastr.success("Curso Eliminado", "Éxito");
      this.modal.dismiss();
    })
  }


}





