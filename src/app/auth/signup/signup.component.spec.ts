import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { AuthResponse, AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockEmail = 'test@test.com';
  const mockPassowrd = '123456';
  const mockRegisterResponse: AuthResponse = {
    idToken: 'mock-id-token',
    email: mockEmail,
    refreshToken: 'mock-refresh-token',
    expiresIn: '3600',
    localId: 'mock-user-id',
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['register$']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the sign up component', () => {
    expect(component).toBeTruthy();
  });

  it('should hide password', () => {
    component.isPasswordVisible.set(true);
    fixture.detectChanges();

    let mouseEvent = new MouseEvent('click');

    component.onClickPasswordVisibilty(mouseEvent);
    fixture.detectChanges();

    expect(component.isPasswordVisible()).toBeFalse();
  });

  it('should show password', () => {
    component.isPasswordVisible.set(false);
    fixture.detectChanges();

    let mouseEvent = new MouseEvent('click');

    component.onClickPasswordVisibilty(mouseEvent);
    fixture.detectChanges();

    expect(component.isPasswordVisible()).toBeTrue();
  });

  it('should hide confirm password', () => {
    component.isConfirmPasswordVisible.set(true);
    fixture.detectChanges();

    let mouseEvent = new MouseEvent('click');

    component.onClickConfirmPasswordVisibilty(mouseEvent);
    fixture.detectChanges();

    expect(component.isConfirmPasswordVisible()).toBeFalse();
  });

  it('should show confirm password', () => {
    component.isConfirmPasswordVisible.set(false);
    fixture.detectChanges();

    let mouseEvent = new MouseEvent('click');

    component.onClickConfirmPasswordVisibilty(mouseEvent);
    fixture.detectChanges();

    expect(component.isConfirmPasswordVisible()).toBeTrue();
  });

  it('should navigate to login onClickLogin', () => {
    component.onClickLogin();

    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should fail user registeration => empty values', () => {
    component.form.setValue({
      confirmPassword: '',
      email: '',
      password: '',
    });

    component.onSubmit();

    expect(authServiceMock.register$).not.toHaveBeenCalled();
  });

  it('should fail user registeration => non matching passwords', () => {
    component.form.setValue({
      email: mockEmail,
      password: mockPassowrd,
      confirmPassword: '1234567',
    });

    component.onSubmit();

    expect(authServiceMock.register$).not.toHaveBeenCalled();
  });

  it('should register user', () => {
    authServiceMock.register$.and.returnValue(of(mockRegisterResponse));

    component.form.setValue({
      email: mockEmail,
      confirmPassword: mockPassowrd,
      password: mockPassowrd,
    });

    component.onSubmit();

    expect(authServiceMock.register$).toHaveBeenCalledWith(
      mockEmail,
      mockPassowrd
    );

    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should update email error message and show required email message', () => {
    component.form.setValue({
      email: '',
      password: '',
      confirmPassword: '',
    });

    component.updateEmailErrorMessage();

    expect(component.emailErrorMessage()).toBe('Email is required');
  });

  it('should update email error message and show invalid email message', () => {
    component.form.setValue({
      email: 'test',
      password: '',
      confirmPassword: '',
    });

    component.updateEmailErrorMessage();

    expect(component.emailErrorMessage()).toBe('Enter a valid email');
  });

  it('should update email error message and clear it', () => {
    component.form.setValue({
      email: mockEmail,
      password: '',
      confirmPassword: '',
    });

    component.updateEmailErrorMessage();

    expect(component.emailErrorMessage()).toBe('');
  });

  it('should update password error message and show required password message', () => {
    component.form.setValue({
      email: '',
      password: '',
      confirmPassword: '',
    });

    component.updatePasswordErrorMessage();

    expect(component.passwordErrorMessage()).toBe('Please enter a password');
  });

  it('should update password error message and show invalid password message', () => {
    component.form.setValue({
      email: '',
      password: '123',
      confirmPassword: '',
    });

    component.updatePasswordErrorMessage();

    expect(component.passwordErrorMessage()).toBe(
      'Password must be at least 6 characters long'
    );
  });

  it('should update password error message and clear message', () => {
    component.form.setValue({
      email: '',
      password: mockPassowrd,
      confirmPassword: '',
    });

    component.updatePasswordErrorMessage();

    expect(component.passwordErrorMessage()).toBe('');
  });

  it('should update confirm password error message and show required confirm password message', () => {
    component.form.setValue({
      email: '',
      password: '',
      confirmPassword: '',
    });

    component.updateConfirmPasswordErrorMessage();

    expect(component.confirmPasswordErrorMessage()).toBe(
      'Please confirm your password'
    );
  });

  it('should update confirm password error message and show invalid confirm password message', () => {
    component.form.setValue({
      email: '',
      password: mockEmail,
      confirmPassword: '1234567',
    });

    component.updateConfirmPasswordErrorMessage();

    expect(component.confirmPasswordErrorMessage()).toBe(
      "Passwords don't match."
    );
  });

  it('should update confirm password error message and clear confirm password message', () => {
    component.form.setValue({
      email: '',
      password: mockPassowrd,
      confirmPassword: mockPassowrd,
    });

    component.updateConfirmPasswordErrorMessage();

    expect(component.confirmPasswordErrorMessage()).toBe('');
  });

  it('should call updateEmailErrorMessage() on blur email input', () => {
    const template: HTMLElement = fixture.nativeElement;
    const input = template.querySelector(
      'input[formControlName="email"]'
    ) as HTMLInputElement;

    const updateEmailErrorMessageSpy = spyOn(
      component,
      'updateEmailErrorMessage'
    );

    input.dispatchEvent(new Event('blur'));

    expect(updateEmailErrorMessageSpy).toHaveBeenCalled();
  });

  it('should call updatePasswordErrorMessage() on blur password input', () => {
    const template: HTMLElement = fixture.nativeElement;
    const input = template.querySelector(
      'input[formControlName="password"]'
    ) as HTMLInputElement;

    const updatePasswordErrorMessageSpy = spyOn(
      component,
      'updatePasswordErrorMessage'
    );

    input.dispatchEvent(new Event('blur'));

    expect(updatePasswordErrorMessageSpy).toHaveBeenCalled();
  });

  it('should call onClickPasswordVisibilty() on click password visibilty', () => {
    const template: HTMLElement = fixture.nativeElement;
    const visibiltyButton: HTMLButtonElement = template.querySelector(
      '#password-visibilty-btn'
    ) as HTMLButtonElement;

    const onClickPasswordVisibiltySpy = spyOn(
      component,
      'onClickPasswordVisibilty'
    );

    visibiltyButton.dispatchEvent(new Event('click'));

    expect(onClickPasswordVisibiltySpy).toHaveBeenCalled();
  });

  it('should call updateConfirmPasswordErrorMessage() on blur confirm password input', () => {
    const template: HTMLElement = fixture.nativeElement;
    const input = template.querySelector(
      'input[formControlName="confirmPassword"]'
    ) as HTMLInputElement;

    const updateConfirmPasswordErrorMessageSpy = spyOn(
      component,
      'updateConfirmPasswordErrorMessage'
    );

    input.dispatchEvent(new Event('blur'));

    expect(updateConfirmPasswordErrorMessageSpy).toHaveBeenCalled();
  });

  it('should call onClickConfirmPasswordVisibilty() on click confirm password visibilty', () => {
    const template: HTMLElement = fixture.nativeElement;
    const visibiltyButton: HTMLButtonElement = template.querySelector(
      '#confirm-password-visibilty-btn'
    ) as HTMLButtonElement;

    const onClickConfirmPasswordVisibiltySpy = spyOn(
      component,
      'onClickConfirmPasswordVisibilty'
    );

    visibiltyButton.dispatchEvent(new Event('click'));

    expect(onClickConfirmPasswordVisibiltySpy).toHaveBeenCalled();
  });

  it('should call onSubmit() on submit form', () => {
    const template: HTMLElement = fixture.nativeElement;
    const form: HTMLFormElement = template.querySelector(
      'form'
    ) as HTMLFormElement;

    const onSubmitSpy = spyOn(component, 'onSubmit');

    form.dispatchEvent(new Event('submit'));

    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it('should call onClickLogin() on click login button', () => {
    const template: HTMLElement = fixture.nativeElement;
    const loginBtn: HTMLButtonElement = template.querySelector(
      'button[type=button]'
    ) as HTMLButtonElement;

    const onClickLoginSpy = spyOn(component, 'onClickLogin');

    loginBtn.dispatchEvent(new Event('click'));

    expect(onClickLoginSpy).toHaveBeenCalled();
  });
});
