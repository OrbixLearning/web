import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameDocumentPopUpComponent } from './rename-document-pop-up.component';

describe('RenameDocumentPopUpComponent', () => {
  let component: RenameDocumentPopUpComponent;
  let fixture: ComponentFixture<RenameDocumentPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameDocumentPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenameDocumentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
