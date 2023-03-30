import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UsersHttpService } from 'src/app/services/users-http.service';

class MockUsersHttpService {
  createNewUser(username: string, password: string, email: string) {
    return of({ success: true });
  }
}

class MockRouter {
  navigate(route: any[]) {}
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [FormsModule, HttpClientModule],
      providers: [
        { provide: UsersHttpService, useClass: MockUsersHttpService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button if the form is invalid', () => {
    const emailInput = fixture.debugElement.query(By.css('[data-cy=email]')).nativeElement;
    const usernameInput = fixture.debugElement.query(By.css('[data-cy=username]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('[data-cy=password]')).nativeElement;
    const button = fixture.debugElement.query(By.css('[data-cy=signup-btn]')).nativeElement;
  
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    usernameInput.value = '';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
  
    fixture.detectChanges();
  
    expect(button.disabled).toBeTruthy();
  });

  it('should have an email input field', () => {
    const emailInput = fixture.debugElement.query(By.css('[data-cy=email]'));
    expect(emailInput).toBeTruthy();
  });
  it('should have a username input field', () => {
    const usernameInput = fixture.debugElement.query(By.css('[data-cy=username]'));
    expect(usernameInput).toBeTruthy();
  });
  it('should have a password input field', () => {
    const passwordInput = fixture.debugElement.query(By.css('[data-cy=password]'));
    expect(passwordInput).toBeTruthy();
  });
  it('should submit the form when the submit button is clicked', () => {
    spyOn(component, 'onSubmitCreateUser');
  
    const emailInput = fixture.debugElement.query(By.css('[data-cy=email]')).nativeElement;
    const usernameInput = fixture.debugElement.query(By.css('[data-cy=username]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('[data-cy=password]')).nativeElement;
    const submitButton = fixture.debugElement.query(By.css('[data-cy=signup-btn]')).nativeElement;
  
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'testpassword';
    passwordInput.dispatchEvent(new Event('input'));
  
    fixture.detectChanges();
  
    submitButton.click();
  
    expect(component.onSubmitCreateUser).toHaveBeenCalled();
  });
  
});
