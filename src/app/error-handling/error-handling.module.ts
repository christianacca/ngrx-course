import { NgModule, ModuleWithProviders } from '@angular/core';
import { ErrorMessageTranslationService, DefaultErrorMessageTranslationService } from './error-message-translation.service';
import { ErrorHandlingModuleConfig } from './error-handling-module.config';
import { SANITIZER_FUNC_ARRAY } from './sanitizer-func-token';
import { ErrorSanitizerFactoryService } from './error-sanitizer-factory.service';

@NgModule({
})
export class ErrorHandlingModule {
    static forRoot(config: ErrorHandlingModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: ErrorHandlingModule,
            providers: [
                ErrorSanitizerFactoryService,
                {
                    provide: ErrorMessageTranslationService,
                    useClass: config.translatorType ? config.translatorType : DefaultErrorMessageTranslationService 
                },
                config.sanitizers ? [{
                    provide: SANITIZER_FUNC_ARRAY,
                    useValue: config.sanitizers
                }] : []
            ]
        };
    }
}
