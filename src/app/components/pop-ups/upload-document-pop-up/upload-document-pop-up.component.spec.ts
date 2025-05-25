import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentPopUpComponent } from './upload-document-pop-up.component';

describe('UploadDocumentPopUpComponent', () => {
  let component: UploadDocumentPopUpComponent;
  let fixture: ComponentFixture<UploadDocumentPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDocumentPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDocumentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
