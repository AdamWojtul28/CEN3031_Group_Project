import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
declare const window: any;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Worldlier');
  });

  it('should have a subtitle', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.auto-type')).toBeTruthy();
  });

  it('should have a link to create an account', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a').textContent).toContain('Create Account');
    expect(compiled.querySelector('a').getAttribute('routerLink')).toEqual('booking');
  });

});
