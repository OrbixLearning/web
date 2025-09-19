import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PerformanceDashboardComponent } from './performance-dashboard.component';
import { ContextService } from '../../../../../services/context.service';
import { DashboardService } from '../../../../../services/dashboard.service';


describe('PerformanceDashboardComponent', () => {
  let component: PerformanceDashboardComponent;
  let fixture: ComponentFixture<PerformanceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceDashboardComponent],
      providers: [DashboardService, ContextService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});