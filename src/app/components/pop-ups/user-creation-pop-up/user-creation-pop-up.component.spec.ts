import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreationPopUpComponent } from './user-creation-pop-up.component';

describe('UserCreationPopUpComponent', () => {
  let component: UserCreationPopUpComponent;
  let fixture: ComponentFixture<UserCreationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreationPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
