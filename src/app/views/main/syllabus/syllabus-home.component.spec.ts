import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SyllabusHomeComponent } from './syllabus-home.component';

describe('SyllabusHomeComponent', () => {
  let component: SyllabusHomeComponent;
  let fixture: ComponentFixture<SyllabusHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyllabusHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});