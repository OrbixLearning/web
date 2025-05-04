import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomDocumentsComponent } from './classroom-documents.component';

describe('ClassroomDocumentsComponent', () => {
  let component: ClassroomDocumentsComponent;
  let fixture: ComponentFixture<ClassroomDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
