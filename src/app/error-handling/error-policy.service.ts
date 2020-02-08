import { ErrorHandler, Injectable, Inject, Optional } from '@angular/core';
import { catchHandleError, catchHandleRethrowError, catchHandleSwallowError, handleError, ErrorHandlerOptions } from './operators';
import { ErrorMessageTranslationService } from './error-message-translation.service';
import { SanitizedError, SanitizerFunc } from './sanitized-error';
import { SANITIZER_FUNC } from './sanitizer-func-token';

@Injectable({providedIn: 'root'})
export class ErrorPolicyService {
    private options: ErrorHandlerOptions = {
        translator: this.errorTranslationService.translate.bind(this.errorTranslationService),
        sanitizer: SanitizedError.createCompositeSanitizer(this.sanitizerFuncs)
    };

    constructor(
        private globalHandler: ErrorHandler,
        private errorTranslationService: ErrorMessageTranslationService,
        @Optional() @Inject(SANITIZER_FUNC) private sanitizerFuncs: SanitizerFunc[]) {
    }
    catchHandle<T>() {
        return catchHandleError<T>(this.globalHandler, this.options);
    }
    catchHandleRethrow<T>() {
        return catchHandleRethrowError<T>(this.globalHandler, this.options);
    }
    catchHandleSwallow<T>() {
        return catchHandleSwallowError<T>(this.globalHandler, this.options);
    }
    handle<T>() {
        return handleError<T>(this.globalHandler, this.options);
    }
}
