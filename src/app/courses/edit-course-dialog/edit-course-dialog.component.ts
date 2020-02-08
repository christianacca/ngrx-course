import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, Observable, combineLatest} from 'rxjs';
import {CourseEntityService} from '../services/course-entity.service';
import { map, exhaustMap, tap, filter, startWith } from 'rxjs/operators';
import { ErrorPolicyService, SanitizedError} from '../../error-handling';

interface ViewModel {
    saving: boolean;
    saveError?: SanitizedError;
}

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
    vm$: Observable<ViewModel>;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditCourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private coursesService: CourseEntityService,
        private errorPolicy: ErrorPolicyService) {

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

        const saves$ = this.saves.pipe(
            map<any, Course>(() => ({
                ...this.course,
                ...this.form.value
            })),
            exhaustMap(course =>
                this.doSave(course).pipe(this.errorPolicy.catchHandle())
            ),
            tap(result => {
                if ((result instanceof SanitizedError)) { return; }
                this.dialogRef.close();
            })
        );

        const saveErrors$ = saves$.pipe(
            filter(SanitizedError.is),
            startWith(null)
        );

        const saving$ = this.coursesService.loading$;

        this.vm$ = combineLatest(saving$, saveErrors$).pipe(
            map(([saving, saveError]) => ({
                saving,
                saveError
            })),
            startWith<ViewModel>({
                saving: false,
                saveError: null
            })
        );
    }

    onClose() {
        this.dialogRef.close();
    }

    private doSave(course: Course) {
        return this.mode === 'create' ? this.coursesService.add(course) : this.coursesService.update(course);
    }
}
