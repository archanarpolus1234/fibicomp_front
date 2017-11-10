import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'session-warning-modal',
  templateUrl: 'warning-modal.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/style.css']
})

export class WarningModalComponent {
  @Output() continueEvent = new EventEmitter<boolean>();
  @Output() logoutEvent = new EventEmitter<boolean>();
  @Input() timeToExit: number;
  @Input() timeToExitinMin: number;
  @Input() timeToExitinSec: number;
  message = false;

  constructor() {}

  sendContinueMessage() {
    this.continueEvent.emit(this.message);
  }

  sendLogoutMessage() {
    this.logoutEvent.emit(this.message);
  }
}
