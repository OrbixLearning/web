import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetPopUpComponent } from './password-reset-pop-up.component';

describe('PasswordResetPopUpComponent', () => {
  let component: PasswordResetPopUpComponent;
  let fixture: ComponentFixture<PasswordResetPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordResetPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordResetPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
