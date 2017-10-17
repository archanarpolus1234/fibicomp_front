import { TestBed, inject } from '@angular/core/testing';

import { SessiontimeoutService } from './sessiontimeout.service';

describe('SessiontimeoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessiontimeoutService]
    });
  });

  it('should be created', inject([SessiontimeoutService], (service: SessiontimeoutService) => {
    expect(service).toBeTruthy();
  }));
});
