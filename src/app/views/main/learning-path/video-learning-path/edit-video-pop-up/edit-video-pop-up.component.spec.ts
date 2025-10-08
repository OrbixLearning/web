import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVideoPopUpComponent } from './edit-video-pop-up.component';

describe('EditVideoPopUpComponent', () => {
  let component: EditVideoPopUpComponent;
  let fixture: ComponentFixture<EditVideoPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVideoPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVideoPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
