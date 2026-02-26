import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOpenEndedPopUpComponent } from './edit-open-ended-pop-up.component';

describe('EditOpenEndedPopUpComponent', () => {
  let component: EditOpenEndedPopUpComponent;
  let fixture: ComponentFixture<EditOpenEndedPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOpenEndedPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOpenEndedPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
