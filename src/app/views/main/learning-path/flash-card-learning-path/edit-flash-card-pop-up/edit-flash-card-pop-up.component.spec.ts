import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFlashCardPopUpComponent } from './edit-flash-card-pop-up.component';

describe('EditFlashCardPopUpComponent', () => {
  let component: EditFlashCardPopUpComponent;
  let fixture: ComponentFixture<EditFlashCardPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFlashCardPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFlashCardPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
