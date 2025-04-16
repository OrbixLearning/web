import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ErrorPopUpComponent } from '../../components/error-pop-up/error-pop-up.component';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const SILENT_URLS = ['logout', 'login', 'auth'];
  const skipUrl = SILENT_URLS.some((u) => req.url.includes(u));
  const skipHeader = req.headers.get('skipErrorInterceptor') === 'true';

  if (skipUrl || skipHeader) {
    return next(req);
  }

  let dialog = inject(MatDialog);
  let authService = inject(AuthService);
  let router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let m = '';
      if (error.error) {
        m =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message || '';
      }

      switch (error.status) {
        case 401:
        case 403:
          m = 'Você não tem permissão ou sua sessão expirou.';
          break;
        case 500:
          m = 'Erro interno do servidor!';
          break;
        case 0:
          m = 'Erro de conexão! Verifique sua internet.';
          break;
      }

      let dialogRef = dialog.open(ErrorPopUpComponent, {
        data: {
          code: error.status,
          message: m,
        },
      });

      const requiresRedirect =
        [401, 403].includes(error.status) && !req.url.includes('logout');

      dialogRef.afterClosed().subscribe(async () => {
        if (requiresRedirect) {
          await lastValueFrom(authService.logout());
          router.navigateByUrl('/login');
        }
      });
      return throwError(() => error);
    })
  );
};
