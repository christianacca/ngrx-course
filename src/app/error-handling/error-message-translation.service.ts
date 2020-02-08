import { Injectable, Provider } from '@angular/core';
import { SanitizedError } from './sanitized-error';
import { Observable, of } from 'rxjs';

@Injectable()
export abstract class ErrorMessageTranslationService {
    abstract translate(err: SanitizedError): Observable<SanitizedError> | PromiseLike<SanitizedError>;
}

@Injectable()
export class DefaultErrorMessageTranslationService extends ErrorMessageTranslationService {
    translate(err: SanitizedError): Observable<SanitizedError> {
        return of(err);
    }
}
