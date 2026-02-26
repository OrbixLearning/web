import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMultipleSelectionPopUpComponent } from './edit-multiple-selection-pop-up.component';

describe('EditMultipleSelectionPopUpComponent', () => {
  let component: EditMultipleSelectionPopUpComponent;
  let fixture: ComponentFixture<EditMultipleSelectionPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMultipleSelectionPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMultipleSelectionPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
