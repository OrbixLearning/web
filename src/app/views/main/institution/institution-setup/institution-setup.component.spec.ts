import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionSetupComponent } from './institution-setup.component';

describe('InstitutionSetupComponent', () => {
  let component: InstitutionSetupComponent;
  let fixture: ComponentFixture<InstitutionSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
