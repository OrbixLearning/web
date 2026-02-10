import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomQuestionsComponent } from './classroom-questions.component';

describe('ClassroomQuestionsComponent', () => {
  let component: ClassroomQuestionsComponent;
  let fixture: ComponentFixture<ClassroomQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
