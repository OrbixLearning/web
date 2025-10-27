import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleUserCreationErrorPopUpComponent } from './multiple-user-creation-error-pop-up.component';

describe('MultipleUserCreationErrorPopUpComponent', () => {
  let component: MultipleUserCreationErrorPopUpComponent;
  let fixture: ComponentFixture<MultipleUserCreationErrorPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleUserCreationErrorPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleUserCreationErrorPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
