import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsersHttpService } from '../../services/users-http.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { User } from 'src/app/models/user.model';

import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let usersHttpService: UsersHttpService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ], 
      declarations: [ AdminComponent ],
      providers: [ UsersHttpService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    usersHttpService = TestBed.inject(UsersHttpService);
    spyOn(usersHttpService, 'fetchUsers').and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onFetchUsers on init', () => {
    spyOn(component, 'onFetchUsers');
    component.ngOnInit();
    expect(component.onFetchUsers).toHaveBeenCalled();
  });
  it('should call denyUser on onDenyUser', () => {
    spyOn(usersHttpService, 'denyUser').and.returnValue(of(null));
    component.onDenyUser('user1');
    expect(usersHttpService.denyUser).toHaveBeenCalledWith('user1');
  });

  it('should call acceptUser on onAcceptUser', () => {
    spyOn(usersHttpService, 'acceptUser').and.returnValue(of(null));
    component.onAcceptUser('user1');
    expect(usersHttpService.acceptUser).toHaveBeenCalledWith('user1');
  });

  it('should call banUser on onBanUser', () => {
    spyOn(usersHttpService, 'banUser').and.returnValue(of(null));
    component.onBanUser('user1');
    expect(usersHttpService.banUser).toHaveBeenCalledWith('user1');
  });
});