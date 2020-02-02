import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditCourseDialogComponent} from '../edit-course-dialog/edit-course-dialog.component';
import {MatDialog} from '@angular/material';
import {map} from 'rxjs/operators';
import {CourseEntityService} from '../services/course-entity.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

    promoTotal$ = this.coursesService.promoCourses$.pipe(
      map(courses => courses.length)
    );

    beginnerCourses$ = this.coursesService.beginnerCourses$;

    advancedCourses$ = this.coursesService.advancedCourses$;

    constructor(
      private dialog: MatDialog,
      private coursesService: CourseEntityService) {
    }

  onAddCourse() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle:"Create Course",
      mode: 'create'
    };

    this.dialog.open(EditCourseDialogComponent, dialogConfig);

  }


}
