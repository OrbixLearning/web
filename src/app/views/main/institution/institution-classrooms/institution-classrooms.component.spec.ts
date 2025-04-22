import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionClassroomsComponent } from './institution-classrooms.component';

describe('InstitutionClassroomsComponent', () => {
  let component: InstitutionClassroomsComponent;
  let fixture: ComponentFixture<InstitutionClassroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionClassroomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutionClassroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
