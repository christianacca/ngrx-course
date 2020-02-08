import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ErrorMessageTranslationService, DefaultErrorMessageTranslationService } from './error-message-translation.service';

@NgModule({
    providers: [
        { provide: ErrorMessageTranslationService, useClass: DefaultErrorMessageTranslationService }
    ]
})
export class ErrorHandlingModule {
    constructor(@Optional() @SkipSelf() parentModule: ErrorHandlingModule) {
        if (parentModule) {
            throw new Error('ErrorHandlingModule is already loaded. Import it in the ErrorHandlingModule only');
        }
    }
}
