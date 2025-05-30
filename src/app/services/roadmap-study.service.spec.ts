import { TestBed } from '@angular/core/testing';

import { RoadmapStudyService } from './roadmap-study.service';

describe('RoadmapStudyService', () => {
  let service: RoadmapStudyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoadmapStudyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
