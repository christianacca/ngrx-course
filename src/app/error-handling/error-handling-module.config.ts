import { Type } from '@angular/core';
import { ErrorMessageTranslationService } from './error-message-translation.service';
import { SanitizerFunc } from './sanitized-error';

export interface ErrorHandlingModuleConfig {
    translatorType?: Type<ErrorMessageTranslationService>;
    sanitizers?: SanitizerFunc[];
}
