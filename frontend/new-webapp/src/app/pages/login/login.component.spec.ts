import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports:[
        HttpClientModule,
        FormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form invalid when both fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have form invalid when username is empty', () => {
    component.loginForm.controls['password'].setValue('12345');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have form invalid when password is empty', () => {
    component.loginForm.controls['username'].setValue('testuser');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have form valid when both fields are filled in', () => {
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('12345');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call onSubmitLogin() method on form submission', () => {
    spyOn(component, 'onSubmitLogin');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(component.onSubmitLogin).toHaveBeenCalled();
  });
});
