import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ChatUserComponent } from './chat-user.component';

describe('ChatUserComponent', () => {
  let component: ChatUserComponent;
  let fixture: ComponentFixture<ChatUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatUserComponent ],
      providers: [ ActivatedRoute ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
