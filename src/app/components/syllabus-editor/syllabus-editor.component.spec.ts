import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusEditorComponent } from './syllabus-editor.component';

describe('SyllabusEditorComponent', () => {
  let component: SyllabusEditorComponent;
  let fixture: ComponentFixture<SyllabusEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyllabusEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
