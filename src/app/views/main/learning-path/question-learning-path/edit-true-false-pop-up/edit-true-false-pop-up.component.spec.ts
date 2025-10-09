import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrueFalsePopUpComponent } from './edit-true-false-pop-up.component';

describe('EditTrueFalsePopUpComponent', () => {
  let component: EditTrueFalsePopUpComponent;
  let fixture: ComponentFixture<EditTrueFalsePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTrueFalsePopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrueFalsePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
