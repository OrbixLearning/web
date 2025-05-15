import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberToClassroomPopUpComponent } from './add-member-to-classroom-pop-up.component';

describe('AddMemberToClassroomPopUpComponent', () => {
  let component: AddMemberToClassroomPopUpComponent;
  let fixture: ComponentFixture<AddMemberToClassroomPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMemberToClassroomPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMemberToClassroomPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
