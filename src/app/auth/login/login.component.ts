import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  emailErrorMessage = signal('');
  paswwordErrorMessage = signal('');
  isPasswordVisible = signal(false);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  updateEmailErrorMessage() {
    if (this.form.controls.email.hasError('required')) {
      this.emailErrorMessage.set('Email is required');
    } else if (this.form.controls.email.hasError('email')) {
      this.emailErrorMessage.set('Entered a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.form.controls.password.hasError('required')) {
      this.paswwordErrorMessage.set('Please enter a password');
    } else if (this.form.controls.password.hasError('minlength')) {
      this.paswwordErrorMessage.set(
        'Password must be at least 6 characters long'
      );
    } else {
      this.paswwordErrorMessage.set('');
    }
  }

  onClickPasswordVisibilty(event: MouseEvent) {
    this.isPasswordVisible.set(!this.isPasswordVisible());
    event.stopPropagation();
  }

  onSubmit() {
    this.updateEmailErrorMessage();
    this.updatePasswordErrorMessage();

    if (this.form.valid && this.form.value.email && this.form.value.password) {
      const subscription = this.authService
        .login$(this.form.value.email, this.form.value.password)
        .subscribe({
          next: () => this.router.navigate(['todos'], { replaceUrl: true }),
        });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }

  onClickSignUp() {
    this.router.navigate(['auth', 'signup']);
  }
}
