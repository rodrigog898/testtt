import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Token expired, try to refresh
          if (!req.url.includes('/auth/refresh')) {
            return authService.refreshToken().pipe(
              switchMap(() => {
                // Retry original request with new token
                const token = authService.getToken();
                const authReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${token}`)
                });
                return next(authReq);
              }),
              catchError(() => {
                authService.logout();
                return throwError(() => error);
              })
            );
          }
          authService.logout();
          break;

        case 403:
          notificationService.showError('No tienes permisos para realizar esta acción');
          break;

        case 404:
          notificationService.showError('Recurso no encontrado');
          break;

        case 500:
          notificationService.showError('Error interno del servidor');
          break;

        default:
          if (error.error?.message) {
            notificationService.showError(error.error.message);
          } else {
            notificationService.showError('Ha ocurrido un error inesperado');
          }
      }

      return throwError(() => error);
    })
  );
};