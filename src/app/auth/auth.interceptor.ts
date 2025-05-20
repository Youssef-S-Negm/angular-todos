import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { switchMap, take } from 'rxjs';

export function tokenInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authService = inject(AuthService);

  return authService.user.pipe(
    take(1),
    switchMap((user) => {
      if (user) {
        const requestWithToken = request.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        return next(requestWithToken);
      }

      return next(request);
    })
  );
}
