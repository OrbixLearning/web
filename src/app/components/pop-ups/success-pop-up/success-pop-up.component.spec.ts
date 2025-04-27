import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPopUpComponent } from './success-pop-up.component';

describe('SuccessPopUpComponent', () => {
  let component: SuccessPopUpComponent;
  let fixture: ComponentFixture<SuccessPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
