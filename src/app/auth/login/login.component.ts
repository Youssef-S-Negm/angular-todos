import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  isPasswordVisible = signal(false);

  formArray = this.formBuilder.array([
    this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    }),
    this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    }),
  ]);

  getFormControl(index: number) {
    return this.formArray.at(index);
  }

  updateEmailErrorMessage() {
    if (this.getFormControl(0).controls['email'].hasError('required')) {
      this.emailErrorMessage.set('Email is required');
    } else if (this.getFormControl(0).controls['email'].hasError('email')) {
      this.emailErrorMessage.set('Enter a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.getFormControl(1).controls['password'].hasError('required')) {
      this.passwordErrorMessage.set('Please enter a password');
    } else if (
      this.getFormControl(1).controls['password'].hasError('minlength')
    ) {
      this.passwordErrorMessage.set(
        'Password must be at least 6 characters long'
      );
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  onClickPasswordVisibilty(event: MouseEvent) {
    this.isPasswordVisible.set(!this.isPasswordVisible());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.getFormControl(0).valid && this.getFormControl(1).valid) {
      const subscription = this.authService
        .login$(
          this.getFormControl(0).value['email'],
          this.getFormControl(1).value['password']
        )
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
