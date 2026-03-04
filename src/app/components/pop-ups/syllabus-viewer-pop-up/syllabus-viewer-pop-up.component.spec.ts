import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusViewerPopUpComponent } from './syllabus-viewer-pop-up.component';

describe('SyllabusViewerPopUpComponent', () => {
  let component: SyllabusViewerPopUpComponent;
  let fixture: ComponentFixture<SyllabusViewerPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyllabusViewerPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusViewerPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
