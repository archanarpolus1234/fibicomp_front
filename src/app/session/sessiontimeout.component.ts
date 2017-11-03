import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

const IDLE_TIME = 1200; // Watching for an event for 600 seconds(10 min.)
const EXIT_TIME = 300;  // Automatically logouts after 10 seconds

@Component( {
    selector: 'app-sessiontimeout',
    templateUrl: 'sessiontimeout.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css']
} )

export class SessiontimeoutComponent implements OnInit, OnDestroy {
    private subscription;
    warningModal: boolean = false;
    timeoutModal: boolean = false;
    exitTimeInMin: number;
    exitTimeInSec: number;
    timerTime: number = Math.ceil( EXIT_TIME / 60 );
    timeToLogout: number = Math.ceil(( IDLE_TIME + EXIT_TIME ) / 60 );

    constructor( private idle: Idle, private router: Router ) {
        idle.setIdle( IDLE_TIME );
        idle.setTimeout( EXIT_TIME );
        idle.setInterrupts( DEFAULT_INTERRUPTSOURCES );
        this.subscription = idle.onTimeoutWarning.subscribe(( countdown: number ) => {
            this.warningModal = true;
            this.exitTimeInMin = Math.floor( countdown / 60 );
            this.exitTimeInSec = countdown % 60;
        } );
        this.subscription = idle.onTimeout.subscribe(() => {
            this.warningModal = false;
            this.timeoutModal = true;
        } );
        idle.watch();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    close( value ) {
        this.warningModal = false;
    }

    closeModal( value ) {
        this.warningModal = false;
        this.idle.watch();
    }

    reRoute( $event ) {
        this.timeoutModal = $event;
        localStorage.removeItem( 'currentUser' );
        localStorage.removeItem( 'userFullname' );
        this.router.navigate( ['/loginpage'] );
    }
    receiveContinueMessage( $event ) {
        this.warningModal = $event;
        this.idle.watch();
    }
}
