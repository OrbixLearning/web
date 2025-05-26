import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusTagsComponent } from './syllabus-tags.component';

describe('SyllabusTagsComponent', () => {
  let component: SyllabusTagsComponent;
  let fixture: ComponentFixture<SyllabusTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyllabusTagsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
