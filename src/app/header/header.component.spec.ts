import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('Header', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockUser: User = new User(
    'mock-email',
    'mock-id',
    'mock-token',
    new Date(new Date().getTime() + 1000)
  );

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    authServiceMock.user = new BehaviorSubject<User | null>(mockUser);

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create Header component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to user observable on start', () => {
    const userSubscriptionSpy = spyOn(
      authServiceMock.user,
      'subscribe'
    ).and.callThrough();

    fixture.detectChanges();

    expect(userSubscriptionSpy).toHaveBeenCalled();
  });

  it('should call AuthService.logout$() on calling onClickLogout()', () => {
    component.onClickLogout();

    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should set isAuthenticated to false when the user value changes to null', () => {
    authServiceMock.user.next(null);

    fixture.detectChanges();

    expect(component.isAuthenticated()).toBeFalse();
  });

  it('should set isAuthenticated to true when the user value changes to non-null', () => {
    authServiceMock.user.next(null);
    fixture.detectChanges();

    authServiceMock.user.next(mockUser);
    fixture.detectChanges();

    expect(component.isAuthenticated()).toBeTrue();
  });

  it('should call onClickLogout() on click logout button', () => {
    fixture.detectChanges(); // to reflect the update value of isAuthenticated, needed to query the button

    const template: HTMLElement = fixture.nativeElement;
    const button: HTMLButtonElement = template.querySelector(
      'button'
    ) as HTMLButtonElement;
    const onClickLogoutSpy = spyOn(component, 'onClickLogout');

    button.dispatchEvent(new Event('click'));

    expect(onClickLogoutSpy).toHaveBeenCalled();
  });
});
