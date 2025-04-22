import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionUsersComponent } from './institution-users.component';

describe('InstitutionUsersComponent', () => {
  let component: InstitutionUsersComponent;
  let fixture: ComponentFixture<InstitutionUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutionUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
