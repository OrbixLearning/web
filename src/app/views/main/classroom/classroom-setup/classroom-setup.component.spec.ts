import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomSetupComponent } from './classroom-setup.component';

describe('ClassroomSetupComponent', () => {
  let component: ClassroomSetupComponent;
  let fixture: ComponentFixture<ClassroomSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
