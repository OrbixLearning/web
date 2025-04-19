import { HttpErrorResponse } from '@angular/common/http';

export class ErrorUtils {
  static extractMessage(error: HttpErrorResponse): string {
    if (!error?.error) return '';

    if (typeof error.error === 'string') {
      return error.error;
    }

    if (
      typeof error.error === 'object' &&
      'message' in error.error &&
      typeof error.error.message === 'string'
    ) {
      return error.error.message;
    }

    return '';
  }
}
