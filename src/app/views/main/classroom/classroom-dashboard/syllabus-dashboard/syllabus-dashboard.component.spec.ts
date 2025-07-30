import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusDashboardComponent } from './syllabus-dashboard.component';

describe('SyllabusDashboardComponent', () => {
  let component: SyllabusDashboardComponent;
  let fixture: ComponentFixture<SyllabusDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyllabusDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
