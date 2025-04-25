import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAccountCallbackComponent } from './link-account-callback.component';

describe('LinkAccountCallbackComponent', () => {
  let component: LinkAccountCallbackComponent;
  let fixture: ComponentFixture<LinkAccountCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkAccountCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkAccountCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
