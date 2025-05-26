import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPopUpComponent } from './document-pop-up.component';

describe('DocumentPopUpComponent', () => {
  let component: DocumentPopUpComponent;
  let fixture: ComponentFixture<DocumentPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
