import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {CourseEntityService} from '../services/course-entity.service';
import { map, exhaustMap } from 'rxjs/operators';

@Component({
    selector: 'course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCourseDialogComponent {

    form: FormGroup;

    dialogTitle: string;

    course: Course;

    mode: 'create' | 'update';

    saves = new Subject<any>();
    saving$ = this.coursesService.loading$;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditCourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private coursesService: CourseEntityService) {

        this.dialogTitle = data.dialogTitle;
        this.course = data.course;
        this.mode = data.mode;

        const formControls = {
            description: ['', Validators.required],
            category: ['', Validators.required],
            longDescription: ['', Validators.required],
            promo: ['', []]
        };

        if (this.mode == 'update') {
            this.form = this.fb.group(formControls);
            this.form.patchValue({...data.course});
        } else if (this.mode == 'create') {
            this.form = this.fb.group({
                ...formControls,
                url: ['', Validators.required],
                iconUrl: ['', Validators.required]
            });
        }

        // todo: handle errors:
        // - show user message
        // - allow user to retry
        // (tech note: make sure observable chain does not terminate due to error )
        this.saves.pipe(
            map<any, Course>(() => ({
                ...this.course,
                ...this.form.value
            })),
            exhaustMap(course => this.doSave(course))
          )
          // no need to unsubscribe here as stream dies with component
          .subscribe(_ => {
                this.dialogRef.close();
          });
    }

    onClose() {
        this.dialogRef.close();
    }

    private doSave(course: Course) {
        return this.mode === 'create' ? this.coursesService.add(course) : this.coursesService.update(course);
    }
}
