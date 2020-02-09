import { ErrorHandler, Injectable } from '@angular/core';
import { catchHandleError, catchHandleRethrowError, catchHandleSwallowError, handleError, ErrorHandlerOptions } from './operators';
import { ErrorMessageTranslationService } from './error-message-translation.service';
import { ErrorSanitizerFactoryService } from './error-sanitizer-factory.service';

@Injectable({providedIn: 'root'})
export class ErrorPolicyService {
    private options: ErrorHandlerOptions = {
        translator: this.errorTranslationService.translate.bind(this.errorTranslationService),
        sanitizer: this.errorSanitizerFactoryService.getSanitizer()
    };

    constructor(
        private globalHandler: ErrorHandler,
        private errorTranslationService: ErrorMessageTranslationService,
        private errorSanitizerFactoryService: ErrorSanitizerFactoryService) {
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
