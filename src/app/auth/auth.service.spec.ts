import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LOGIN_URL, SIGNUP_URL } from '../firebase/firebase.config';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';
  const mockSignUpResponse = {
    idToken: 'mock-token',
    email: mockEmail,
    refreshToken: 'mock-refresh',
    expiresIn: '3600',
    localId: 'mock-id',
  };
  const mockSignInResponse = {
    ...mockSignUpResponse,
    registered: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should sign up a user and return a response', () => {
    authService.register$(mockEmail, mockPassword).subscribe((res) => {
      expect(res).toEqual(mockSignUpResponse);
    });

    const req = httpMock.expectOne(SIGNUP_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: mockEmail,
      password: mockPassword,
      returnSecureToken: true,
    });

    req.flush(mockSignUpResponse);
  });

  it('should fail the sign up request and return a bad request', () => {
    authService.register$(mockEmail, mockPassword).subscribe({
      next: () => fail('Should have failed the test'),
      error: (error) => expect(error.status).toBe(400),
    });

    const req = httpMock.expectOne(SIGNUP_URL);
    req.flush(null, { status: 400, statusText: 'Bad Request' });
  });

  it('should sign in a user and return a response', () => {
    const handleAuthenticationSpy = spyOn(
      authService as any,
      'handleAuthentication'
    ).and.callThrough(); // call through to check if the internal methods are called in handleAuthentication().
    const autoLogoutSpy = spyOn(authService as any, 'autoLogout');

    authService.login$(mockEmail, mockPassword).subscribe((res) => {
      expect(res).toEqual(mockSignInResponse);
      expect(handleAuthenticationSpy).toHaveBeenCalledWith(
        mockSignInResponse.email,
        mockSignInResponse.localId,
        mockSignInResponse.idToken,
        Number(res.expiresIn)
      );
      expect(localStorage.getItem('user')).toContain(mockEmail);
      expect(autoLogoutSpy).toHaveBeenCalledWith(
        +mockSignInResponse.expiresIn * 1000
      );
      expect(authService.userId).toBe(mockSignInResponse.localId);
    });

    const req = httpMock.expectOne(LOGIN_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: mockEmail,
      password: mockPassword,
      returnSecureToken: true,
    });

    req.flush(mockSignInResponse);
  });

  it('should fail the sign in request and return a bad request', () => {
    authService.login$(mockEmail, mockPassword).subscribe({
      next: () => fail('Should have failed the test'),
      error: (error) => expect(error.status).toBe(400),
    });

    const req = httpMock.expectOne(LOGIN_URL);
    req.flush(null, { status: 400, statusText: 'Bad Request' });
  });

  it('should load user when stored token is valid', () => {
    const expirationDate = new Date(
      new Date().getTime() + +mockSignInResponse.expiresIn * 1000
    );
    const mockUser = new User(
      mockEmail,
      mockSignInResponse.localId,
      mockSignInResponse.idToken,
      expirationDate
    );
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: mockEmail,
        id: mockSignInResponse.localId,
        _token: mockSignInResponse.idToken,
        _tokenExpirationDate: expirationDate.toISOString(),
      })
    );

    const autoLogoutSpy = spyOn(authService as any, 'autoLogout');

    authService.autoLogin();
    authService.user.subscribe((user) => {
      expect(user).toBeTruthy();

      expect(user?.id).toBe(mockUser.id);
      expect(user?.email).toBe(mockUser.email);
      expect(user?.token).toBe(mockUser.token);
    });

    expect(autoLogoutSpy).toHaveBeenCalled();
    expect(authService.userId).toBe(mockSignInResponse.localId);
  });

  it('should not load user when the token is invalid', () => {
    const expirationDate = new Date(
      new Date().getTime() - +mockSignInResponse.expiresIn * 1000
    );
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: mockEmail,
        id: mockSignInResponse.localId,
        _token: mockSignInResponse.idToken,
        _tokenExpirationDate: expirationDate.toISOString(),
      })
    );

    authService.autoLogin();
    authService.user.subscribe((user) => {
      expect(user).toBeFalsy();
    });
  });

  it('should not load user when not found in localStorage', () => {
    authService.autoLogin();
    authService.user.subscribe((user) => expect(user).toBeFalsy());
  });

  it('should reset user stata and clear user data from storage on logout', () => {
    const expirationDate = new Date(
      new Date().getTime() + +mockSignInResponse.expiresIn * 1000
    );
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: mockEmail,
        id: mockSignInResponse.localId,
        _token: mockSignInResponse.idToken,
        _tokenExpirationDate: expirationDate.toISOString(),
      })
    );

    authService.autoLogin();
    authService.logout();

    authService.user.subscribe((user) => {
      expect(user).toBeNull();
    });

    expect(localStorage.getItem('user')).toBeNull();
    expect(authService.userId).toBeNull();
  });

  it('should autoLogout user after 1 second', (done) => {
    const logoutSpy = spyOn(authService as any, 'logout');

    const expirationDate = new Date(new Date().getTime() + 1000);

    localStorage.setItem(
      'user',
      JSON.stringify({
        email: mockEmail,
        id: mockSignInResponse.localId,
        _token: mockSignInResponse.idToken,
        _tokenExpirationDate: expirationDate.toISOString(),
      })
    );

    authService.autoLogin();

    setTimeout(() => {
      expect(logoutSpy).toHaveBeenCalled();
      done();
    }, 1100);
  });
});
