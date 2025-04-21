import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionSettingsComponent } from './institution-settings.component';

describe('InstitutionSettingsComponent', () => {
  let component: InstitutionSettingsComponent;
  let fixture: ComponentFixture<InstitutionSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
