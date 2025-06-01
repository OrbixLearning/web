import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusPresetDeletionPopUpComponent } from './syllabus-preset-deletion-pop-up.component';

describe('SyllabusPresetDeletionPopUpComponent', () => {
  let component: SyllabusPresetDeletionPopUpComponent;
  let fixture: ComponentFixture<SyllabusPresetDeletionPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyllabusPresetDeletionPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusPresetDeletionPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
