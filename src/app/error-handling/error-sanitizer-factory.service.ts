import { Injectable, Optional, Inject } from '@angular/core';
import { SANITIZER_FUNC, SANITIZER_FUNC_ARRAY } from './sanitizer-func-token';
import { SanitizerFunc, SanitizedError } from './sanitized-error';

@Injectable()
export class ErrorSanitizerFactoryService {
    readonly sanitizerFuncs: SanitizerFunc[];
    constructor(
        @Optional() @Inject(SANITIZER_FUNC) sanitizerFuncs: SanitizerFunc[],
        @Optional() @Inject(SANITIZER_FUNC_ARRAY) sanitizerFuncsFromRoot: SanitizerFunc[]) {
            this.sanitizerFuncs = [...sanitizerFuncsFromRoot || [], ...sanitizerFuncs || []];
        }
    getSanitizer() {
        return SanitizedError.createCompositeSanitizer(this.sanitizerFuncs);
    }
}
