import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomMembersComponent } from './classroom-members.component';

describe('ClassroomMembersComponent', () => {
  let component: ClassroomMembersComponent;
  let fixture: ComponentFixture<ClassroomMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
