import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomHomeComponent } from './classroom-home.component';

describe('ClassroomHomeComponent', () => {
  let component: ClassroomHomeComponent;
  let fixture: ComponentFixture<ClassroomHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
