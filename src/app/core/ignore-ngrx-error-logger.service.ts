import { Injectable } from '@angular/core';
import { DefaultLogger } from '@ngrx/data';

/**
 * Ignore requests to log error that ngrx/data would otherwise report
 *
 * ngrx/data will log error for things like non-successful http response
 * This is not ideal as not every non-success response should be considered
 * an error that cannot be recovered from. For example, the client might
 * expect to pass responsibility to validate user input to the server.
 * In this case a 400 response is expected and certainly not an error /
 * unexpected exception
 */
@Injectable()
export class IgnorerNgrxErrorLogger extends DefaultLogger {
    error(_message?: any, ..._optionalParams: any[]): void {
        // do nothing
    }
}
