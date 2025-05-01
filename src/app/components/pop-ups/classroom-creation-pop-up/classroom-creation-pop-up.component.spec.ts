import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomCreationPopUpComponent } from './classroom-creation-pop-up.component';

describe('ClassroomCreationPopUpComponent', () => {
  let component: ClassroomCreationPopUpComponent;
  let fixture: ComponentFixture<ClassroomCreationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomCreationPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomCreationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
