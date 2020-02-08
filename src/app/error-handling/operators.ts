import { ErrorHandler } from '@angular/core';
import { catchError, map, mergeMap, tap, mergeMapTo } from 'rxjs/operators';
import { empty, of, throwError, Observable, identity } from 'rxjs';
import { SanitizedError, SanitizerFunc } from './sanitized-error';

export type TranslatorFunction = (err: SanitizedError) => Observable<SanitizedError>;


export interface ErrorHandlerOptions {
    sanitizer?: SanitizerFunc;
    translator?: TranslatorFunction;
}

export function humanizeError<T>(options: ErrorHandlerOptions = {}) {
    const { sanitizer, translator } = options;
    return (source$: Observable<T>) => source$.pipe(
        map(err => SanitizedError.sanitize(err, sanitizer)),
        translator ? mergeMap(translator) : identity
    );
}

export function notifyError<T extends SanitizedError>(handler: ErrorHandler) {
    return (source$: Observable<T>) => source$.pipe(
        tap(err => {
            if (err.isError === false || err.isLogged === true) { return; }
            err.isLogged = true;
            handler.handleError(err);
        })
    );
}


export function handleError<T>(handler: ErrorHandler, options?: ErrorHandlerOptions) {
    
    return (source$: Observable<T>) => source$.pipe(
        humanizeError(options),
        notifyError(handler)
    );
}

export function catchHandleError<T>(handler: ErrorHandler, options?: ErrorHandlerOptions) {
    return (source$: Observable<T>) => source$.pipe(
        catchError(err => of(err).pipe(
            handleError(handler, options)
        ))
    );
}

export function catchHandleSwallowError<T>(handler: ErrorHandler, options?: ErrorHandlerOptions) {
    return (source$: Observable<T>) => source$.pipe(
        catchError(err => of(err).pipe(
            handleError(handler, options),
            mergeMapTo(empty())
        ))
    );
}

export function catchHandleRethrowError<T>(handler: ErrorHandler, options?: ErrorHandlerOptions) {
    return (source$: Observable<T>) => source$.pipe(
        catchError(err => of(err).pipe(
            handleError(handler, options),
            mergeMap(sanitizedErr => throwError(sanitizedErr))
        ))
    );
}
