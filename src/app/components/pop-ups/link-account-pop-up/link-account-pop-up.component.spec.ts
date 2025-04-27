import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAccountPopUpComponent } from './link-account-pop-up.component';

describe('LinkAccountPopUpComponent', () => {
  let component: LinkAccountPopUpComponent;
  let fixture: ComponentFixture<LinkAccountPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkAccountPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkAccountPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
