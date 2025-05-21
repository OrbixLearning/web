import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusTopicCreationPopUpComponent } from './syllabus-topic-creation-pop-up.component';

describe('SyllabusTopicCreationPopUpComponent', () => {
  let component: SyllabusTopicCreationPopUpComponent;
  let fixture: ComponentFixture<SyllabusTopicCreationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyllabusTopicCreationPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusTopicCreationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
