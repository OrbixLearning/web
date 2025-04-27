import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpButtonsComponent } from './pop-up-buttons.component';

describe('PopUpButtonsComponent', () => {
  let component: PopUpButtonsComponent;
  let fixture: ComponentFixture<PopUpButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
