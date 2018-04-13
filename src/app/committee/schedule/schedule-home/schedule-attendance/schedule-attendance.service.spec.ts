import { TestBed, inject } from '@angular/core/testing';

import { ScheduleAttendanceService } from './schedule-attendance.service';

describe('ScheduleAttendanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScheduleAttendanceService]
    });
  });

  it('should be created', inject([ScheduleAttendanceService], (service: ScheduleAttendanceService) => {
    expect(service).toBeTruthy();
  }));
});
