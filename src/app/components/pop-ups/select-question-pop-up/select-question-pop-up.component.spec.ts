import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuestionPopUpComponent } from './select-question-pop-up.component';

describe('SelectQuestionPopUpComponent', () => {
  let component: SelectQuestionPopUpComponent;
  let fixture: ComponentFixture<SelectQuestionPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectQuestionPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectQuestionPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
