import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapsModule } from '@angular/google-maps';

import { MapDisplayComponent } from './map-display.component';

describe('MapDisplayComponent', () => {
  let component: MapDisplayComponent;
  let fixture: ComponentFixture<MapDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapDisplayComponent ],
      imports: [ GoogleMapsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
