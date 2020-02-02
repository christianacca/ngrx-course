import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory, EntitySelectorsFactory} from '@ngrx/data';
import {Course} from '../model/course';
import { Observable } from 'rxjs/internal/Observable';
// import { map, shareReplay } from 'rxjs/operators';
import { createSelector } from '@ngrx/store';


@Injectable()
export class CourseEntityService
    extends EntityCollectionServiceBase<Course> {

    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;
    promoCourses$: Observable<Course[]>;

    constructor(
        serviceElementsFactory:
            EntityCollectionServiceElementsFactory) {

        super('Course', serviceElementsFactory);

        const {
            selectBeginnerCourses,
            selectAdvancedCourses,
            selectPromoCourses
        } = this.createCustomSelectors();

        this.beginnerCourses$ = this.store.select(selectBeginnerCourses);
        this.advancedCourses$ = this.store.select(selectAdvancedCourses);
        this.promoCourses$ = this.store.select(selectPromoCourses);

        // Note: Use ngrx selectors (instead of shareReplay technique below) when you want:
        // 1. to compose further derived streams
        // 2. prefere to do this using functions rather than chain onto one of existing observables above

        // alternatively use shareReplay rather than memoized selectors
        // (both techniques eliminate unnecessary array filters running)
        // IMPORTANT: needs rxjs 6.4.0 to buffer old emmissions as expected

        // this.beginnerCourses$ = this.entities$.pipe(
        //     map(courses => courses.filter(course => course.category == 'BEGINNER')),
        //     shareReplay(1)
        // );

        // this.advancedCourses$ = this.entities$.pipe(
        //     map(courses => courses.filter(course => course.category == 'ADVANCED')),
        //     shareReplay(1)
        // );

        // this.promoCourses$ = this.entities$.pipe(
        //     map(courses => courses.filter(course => course.promo)),
        //     shareReplay(1)
        // );
    }

    private createCustomSelectors() {
        const courseSelectors = new EntitySelectorsFactory().create<Course>('Course');

        const selectBeginnerCourses = createSelector(
            courseSelectors.selectEntities,
            courses => courses.filter(course => course.category == 'BEGINNER')
        );

        const selectAdvancedCourses = createSelector(
            courseSelectors.selectEntities,
            courses => courses.filter(course => course.category == 'ADVANCED')
        );

        const selectPromoCourses = createSelector(
            courseSelectors.selectEntities,
            courses => courses.filter(course => course.promo)
        );

        return {
            selectBeginnerCourses,
            selectAdvancedCourses,
            selectPromoCourses
        };
    }
}

