import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListingsHttpService } from '../../services/listings-http.service';
import { FormsModule } from '@angular/forms';  // import the FormsModule


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
});
