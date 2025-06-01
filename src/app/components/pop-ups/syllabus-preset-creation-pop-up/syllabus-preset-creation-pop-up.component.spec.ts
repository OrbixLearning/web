import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusPresetCreationPopUpComponent } from './syllabus-preset-creation-pop-up.component';

describe('SyllabusPresetCreationPopUpComponent', () => {
  let component: SyllabusPresetCreationPopUpComponent;
  let fixture: ComponentFixture<SyllabusPresetCreationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyllabusPresetCreationPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusPresetCreationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
