import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { UsersHttpService } from 'src/app/services/users-http.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let usersServiceSpy: jasmine.SpyObj<UsersHttpService>;

  beforeEach(() => {
    activatedRouteStub = {
      params: of({ username: 'test-user' })
    };

    usersServiceSpy = jasmine.createSpyObj('UsersHttpService', ['fetchUserByUsername', 'logoutUser']);

    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UsersHttpService, useValue: usersServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the username in the title', () => {
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('h3');
    expect(titleElement.textContent).toContain('test-user\'s Profile');
  });

  it('should call fetchUserByUsername with the correct parameter', () => {
    expect(usersServiceSpy.fetchUserByUsername).toHaveBeenCalledWith('test-user');
  });

  it('should call logoutUser when the logout button is clicked', () => {
    const logoutButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-cy="logout-btn"]');
    logoutButton.click();
    expect(usersServiceSpy.logoutUser).toHaveBeenCalled();
  });

  it('should toggle the password visibility when the eye icon is clicked', () => {
    const eyeIcon: HTMLElement = fixture.nativeElement.querySelector('.fa-eye-slash');
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('[data-cy="password"]');
    expect(passwordInput.type).toEqual('password');
    eyeIcon.click();
    expect(passwordInput.type).toEqual('text');
    eyeIcon.click();
    expect(passwordInput.type).toEqual('password');
  });

});