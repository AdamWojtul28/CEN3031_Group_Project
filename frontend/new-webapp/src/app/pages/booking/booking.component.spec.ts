import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListingsHttpService } from '../../services/listings-http.service';
import { FormsModule } from '@angular/forms';  // import the FormsModule
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NgModel } from '@angular/forms';

import { BookingComponent } from './booking.component';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingComponent ],
      imports: [ FormsModule, HttpClientTestingModule ],
      providers: [ ListingsHttpService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should call onSubmit() method when form is submitted', () => {
    spyOn(component, 'onSubmit');
    
    const formElement = fixture.debugElement.query(By.css('form')).nativeElement;
    const cityInput = fixture.debugElement.query(By.css('[name=city]')).nativeElement;
    const distanceInput = fixture.debugElement.query(By.css('[name=distance]')).nativeElement;
  
    cityInput.value = 'New York, USA';
    cityInput.dispatchEvent(new Event('input'));
    distanceInput.value = '10';
    distanceInput.dispatchEvent(new Event('input'));
  
    fixture.detectChanges();
  
    formElement.dispatchEvent(new Event('submit'));
  
    expect(component.onSubmit).toHaveBeenCalled();
  });
  it('should show "Search was sent!" message when search is successful', () => {
    spyOn(component.listingsHttpService, 'searchListing').and.returnValue(of({}));
  
    const formElement = fixture.debugElement.query(By.css('form')).nativeElement;
    const cityInput = fixture.debugElement.query(By.css('[name=city]')).nativeElement;
    const distanceInput = fixture.debugElement.query(By.css('[name=distance]')).nativeElement;
  
    cityInput.value = 'New York, USA';
    cityInput.dispatchEvent(new Event('input'));
    distanceInput.value = '10';
    distanceInput.dispatchEvent(new Event('input'));
  
    fixture.detectChanges();
  
    formElement.dispatchEvent(new Event('submit'));
  
    fixture.detectChanges();
  
    const searchSentMessage = fixture.debugElement.query(By.css('[data-cy=http-sent]')).nativeElement;
    expect(searchSentMessage).toBeTruthy();
  });
});
