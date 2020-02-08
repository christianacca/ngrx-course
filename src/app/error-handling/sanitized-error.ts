export type SanitizerFunc = (err: any) => SanitizedError;

export class SanitizedError {
    message: string;
    isError = true;
    isLogged?: boolean;
    originalError: any;
    static genericError(originalError: any) {
        return new SanitizedError({
            message: originalError.message || 'Sorry there was a problem encountered. The problem has been logged',
            originalError
        });
    }
    static createCompositeSanitizer(sanitizers: SanitizerFunc[]): SanitizerFunc {
        const sanitizers2 = (sanitizers || []).filter(s => s != null);
        return (err: any) => {
            for (let i = 0; i < sanitizers2.length; i++) {
                const sanitized = sanitizers2[i](err);
                if (SanitizedError.is(sanitized)) {
                    return sanitized;
                }
            }
        }
    }
    static sanitize(err: any, sanitizer: SanitizerFunc) {
        return SanitizedError.createCompositeSanitizer([sanitizer, SanitizedError.genericError])(err);
    }
    static is(value: any): value is SanitizedError {
        return value instanceof SanitizedError;
    }
    constructor(data: Partial<SanitizedError>) {
        Object.assign(this, data);
    }
}
