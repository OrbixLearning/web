import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMultipleChoicePopUpComponent } from './edit-multiple-choice-pop-up.component';

describe('EditMultipleChoicePopUpComponent', () => {
  let component: EditMultipleChoicePopUpComponent;
  let fixture: ComponentFixture<EditMultipleChoicePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMultipleChoicePopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMultipleChoicePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
