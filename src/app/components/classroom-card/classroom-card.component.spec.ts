import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomCardComponent } from './classroom-card.component';

describe('ClassroomCardComponent', () => {
  let component: ClassroomCardComponent;
  let fixture: ComponentFixture<ClassroomCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
