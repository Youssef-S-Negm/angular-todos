import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  isAuthenticated = signal(false);

  ngOnInit(): void {
    const subscription = this.authService.user.subscribe({
      next: (user) => {
        this.isAuthenticated.set(!!user);

        if (!user) {
          this.router.navigate(['auth', 'login'], { replaceUrl: true });
        }
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onClickLogout() {
    this.authService.logout();
  }
}
