import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LOGIN_URL, SIGNUP_URL } from '../firebase/firebase.config';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';

interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private isAuthenticating = signal(false);
  private tokenExpirationTimer: any;

  isLoading = this.isAuthenticating.asReadonly();
  user = new BehaviorSubject<User | null>(null);

  register$(email: string, password: string) {
    this.isAuthenticating.set(true);

    return this.httpClient
      .post<AuthResponse>(SIGNUP_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        tap({
          complete: () => this.isAuthenticating.set(false),
        })
      );
  }

  login$(email: string, password: string) {
    this.isAuthenticating.set(true);

    return this.httpClient
      .post<AuthResponse>(LOGIN_URL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        tap({
          next: (response) =>
            this.handleAuthentication(
              response.email,
              response.localId,
              response.idToken,
              Number(response.expiresIn)
            ),
          complete: () => this.isAuthenticating.set(false),
        })
      );
  }

  autoLogin() {
    const storedData = localStorage.getItem('user');

    if (!storedData) {
      return;
    }

    const storedUserData: UserData = JSON.parse(storedData);
    const loadedUser = new User(
      storedUserData.email,
      storedUserData.id,
      storedUserData._token,
      new Date(storedUserData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      const expirationDuration =
        new Date(storedUserData._tokenExpirationDate).getTime() -
        new Date().getTime();

      this.user.next(loadedUser);
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('user');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.autoLogout(expiresIn * 1000);
  }
}
