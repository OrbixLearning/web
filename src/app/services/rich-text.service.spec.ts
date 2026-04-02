import { TestBed } from '@angular/core/testing';

import { RichTextService } from './rich-text.service';

describe('RichTextService', () => {
  let service: RichTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RichTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
