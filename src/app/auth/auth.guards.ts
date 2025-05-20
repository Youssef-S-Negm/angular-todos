import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user.pipe(
    tap({
      next: (user) => {
        if (!user) {
          router.navigate(['auth', 'login'], { replaceUrl: true });
        }
      },
    }),
    map((user) => !!user)
  );
};
