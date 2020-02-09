import { DataServiceError } from '@ngrx/data';
import { SanitizedError } from '../error-handling';
import { HttpErrorResponse } from '@angular/common/http';

export function sanitizeNgrxDataHttpError(err: any) {
    if (!(err instanceof DataServiceError)) { return undefined; }

    return new SanitizedError({
        message: err.message,
        isError: isError(err.error),
        originalError: err
    });

    function isError(reponseError: any) {
        if (reponseError instanceof HttpErrorResponse) {
            return reponseError.status !== 400;
        } else {
            return true;
        }
    }
}
