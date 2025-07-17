import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSyllabusTopicPopUpComponent } from './edit-syllabus-topic-pop-up.component';

describe('EditSyllabusTopicPopUpComponent', () => {
  let component: EditSyllabusTopicPopUpComponent;
  let fixture: ComponentFixture<EditSyllabusTopicPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSyllabusTopicPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSyllabusTopicPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
