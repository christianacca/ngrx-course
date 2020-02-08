import { NgModule, Optional, SkipSelf } from '@angular/core';
import { IgnorerNgrxErrorLogger } from './ignore-ngrx-error-logger.service';
import { Logger } from '@ngrx/data';
import { SANITIZER_FUNC } from '../error-handling/sanitizer-func-token';
import { sanitizeNgrxDataHttpError } from './sanitize-ngrx-data-http-error';


@NgModule({
    providers: [
        { provide: Logger, useClass: IgnorerNgrxErrorLogger},
        { provide: SANITIZER_FUNC, useValue: sanitizeNgrxDataHttpError, multi: true }
    ],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the CoreModule only');
        }
    }
}
