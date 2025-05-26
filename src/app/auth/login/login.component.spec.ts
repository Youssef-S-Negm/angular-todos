import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthResponse, AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
    registered: true,
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login$']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component', () => {
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

  it('should navigate to sign up onClickSignUp', () => {
    component.onClickSignUp();

    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should fail user authentication => empty values', () => {
    component.form.setValue({
      email: '',
      password: '',
    });

    component.onSubmit();

    expect(authServiceMock.login$).not.toHaveBeenCalled();
  });

  it('should authenticate user', () => {
    authServiceMock.login$.and.returnValue(of(mockRegisterResponse));

    component.form.setValue({
      email: mockEmail,
      password: mockPassowrd,
    });

    component.onSubmit();

    expect(authServiceMock.login$).toHaveBeenCalledWith(
      mockEmail,
      mockPassowrd
    );

    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should update email error message and show required email message', () => {
    component.form.setValue({
      email: '',
      password: '',
    });

    component.updateEmailErrorMessage();

    expect(component.emailErrorMessage()).toBe('Email is required');
  });

  it('should update email error message and show invalid email message', () => {
    component.form.setValue({
      email: 'test',
      password: '',
    });

    component.updateEmailErrorMessage();

    expect(component.emailErrorMessage()).toBe('Enter a valid email');
  });

  it('should update email error message and clear it', () => {
    component.form.setValue({
      email: mockEmail,
      password: '',
    });

    component.updateEmailErrorMessage();

    expect(component.emailErrorMessage()).toBe('');
  });

  it('should update password error message and show required password message', () => {
    component.form.setValue({
      email: '',
      password: '',
    });

    component.updatePasswordErrorMessage();

    expect(component.passwordErrorMessage()).toBe('Please enter a password');
  });

  it('should update password error message and show invalid password message', () => {
    component.form.setValue({
      email: '',
      password: '123',
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
    });

    component.updatePasswordErrorMessage();

    expect(component.passwordErrorMessage()).toBe('');
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

  it('should call onSubmit() on submit form', () => {
    const template: HTMLElement = fixture.nativeElement;
    const form: HTMLFormElement = template.querySelector(
      'form'
    ) as HTMLFormElement;

    const onSubmitSpy = spyOn(component, 'onSubmit');

    form.dispatchEvent(new Event('submit'));

    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it('should call onClickSignUp() on click sign up button', () => {
    const template: HTMLElement = fixture.nativeElement;
    const loginBtn: HTMLButtonElement = template.querySelector(
      'button[type=button]'
    ) as HTMLButtonElement;

    const onClickSignUpSpy = spyOn(component, 'onClickSignUp');

    loginBtn.dispatchEvent(new Event('click'));

    expect(onClickSignUpSpy).toHaveBeenCalled();
  });
});
