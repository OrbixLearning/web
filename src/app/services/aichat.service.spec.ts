import { TestBed } from '@angular/core/testing';

import { AIChatService } from './aichat.service';

describe('AIChatService', () => {
  let service: AIChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AIChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
