import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIPreferencesFormComponent } from './aipreferences-form.component';

describe('AIPreferencesFormComponent', () => {
  let component: AIPreferencesFormComponent;
  let fixture: ComponentFixture<AIPreferencesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AIPreferencesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AIPreferencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
