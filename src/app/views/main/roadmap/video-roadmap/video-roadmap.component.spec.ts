import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRoadmapComponent } from './video-roadmap.component';

describe('VideoRoadmapComponent', () => {
  let component: VideoRoadmapComponent;
  let fixture: ComponentFixture<VideoRoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoRoadmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
