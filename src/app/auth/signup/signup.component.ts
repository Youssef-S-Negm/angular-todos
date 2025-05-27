import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

function equalValues(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ notEqualValues: true });
  } else {
    const confirmControl = control.get('confirmPassword');

    if (confirmControl?.hasError('notEqualValues')) {
      const errors = { ...confirmControl.errors };
      delete errors['notEqualValues'];

      if (Object.keys(errors).length === 0) {
        confirmControl.setErrors(null);
      } else {
        confirmControl.setErrors(errors);
      }
    }
  }

  return null;
}

@Component({
  selector: 'app-signup',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  confirmPasswordErrorMessage = signal('');
  isPasswordVisible = signal(false);
  isConfirmPasswordVisible = signal(false);

  formArray = this.formBuilder.array([
    this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    }),
    this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [equalValues] }
    ),
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

  updateConfirmPasswordErrorMessage() {
    if (
      this.getFormControl(1).controls['confirmPassword'].hasError('required')
    ) {
      this.confirmPasswordErrorMessage.set('Please confirm your password');
    } else if (
      this.getFormControl(1).controls['confirmPassword'].hasError(
        'notEqualValues'
      )
    ) {
      this.confirmPasswordErrorMessage.set("Passwords don't match.");
    } else {
      this.confirmPasswordErrorMessage.set('');
    }
  }

  onClickPasswordVisibilty(event: MouseEvent) {
    this.isPasswordVisible.set(!this.isPasswordVisible());
    event.stopPropagation();
  }

  onClickConfirmPasswordVisibilty(event: MouseEvent) {
    this.isConfirmPasswordVisible.set(!this.isConfirmPasswordVisible());
    event.stopPropagation();
  }

  onClickLogin() {
    this.router.navigate(['auth', 'login']);
  }

  onSubmit() {
    if (this.getFormControl(0).valid && this.getFormControl(1).valid) {
      const subscription = this.authService
        .register$(
          this.getFormControl(0).value['email'],
          this.getFormControl(1).value['password']
        )
        .subscribe({
          next: () =>
            this.router.navigate(['auth', 'login'], { replaceUrl: true }),
        });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }
}
