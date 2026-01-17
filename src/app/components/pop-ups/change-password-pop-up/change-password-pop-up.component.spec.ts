import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordPopUpComponent } from './change-password-pop-up.component';

describe('ChangePasswordPopUpComponent', () => {
  let component: ChangePasswordPopUpComponent;
  let fixture: ComponentFixture<ChangePasswordPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
