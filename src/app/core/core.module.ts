import { NgModule, Optional, SkipSelf } from '@angular/core';
import { IgnorerNgrxErrorLogger } from './ignore-ngrx-error-logger.service';
import { Logger } from '@ngrx/data';
import { ErrorHandlingModule } from '../error-handling';
import { sanitizeNgrxDataHttpError } from './sanitize-ngrx-data-http-error';

@NgModule({
    imports: [
        ErrorHandlingModule.forRoot({
            sanitizers: [sanitizeNgrxDataHttpError]
        })
    ],
    providers: [
        { provide: Logger, useClass: IgnorerNgrxErrorLogger}
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the CoreModule only');
        }
    }
}
