import {Injectable, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';


const IDLE_TIME = 600; // Watching for an event for 600 seconds(10 min.)
const EXIT_TIME = 10;  // Automatically logouts after 10 seconds

@Injectable()
export class SessiontimeoutService implements OnDestroy {
  private subscription;
  constructor(private idle: Idle, private router: Router) {
    idle.setIdle(IDLE_TIME);
    idle.setTimeout(EXIT_TIME);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.subscription = idle.onTimeoutWarning.subscribe((countdown: number) => {
      console.log('TimeoutWarning: ' + countdown);
    });
    this.subscription = idle.onTimeout.subscribe(() => {
      console.log('Timeout');
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('userFullname');
      this.router.navigate(['/loginpage']);
      alert('Your session has been timedout');
      console.log('Rerouting..');
    });
    idle.watch();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

