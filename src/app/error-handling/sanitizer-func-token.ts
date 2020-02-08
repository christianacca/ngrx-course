import { InjectionToken } from "@angular/core";
import { SanitizerFunc } from "./sanitized-error";

export const SANITIZER_FUNC = new InjectionToken<SanitizerFunc>('SanitizerFunc Injection Token')