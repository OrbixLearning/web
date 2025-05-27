import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionRoadmapComponent } from './question-roadmap.component';

describe('QuestionRoadmapComponent', () => {
  let component: QuestionRoadmapComponent;
  let fixture: ComponentFixture<QuestionRoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionRoadmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
