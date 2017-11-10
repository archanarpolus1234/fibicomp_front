import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'session-timeout-modal',
  templateUrl: './timeout-modal.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/style.css']
})

export class TimeoutModalComponent {
  @Output() logoutEvent = new EventEmitter<boolean>();
  @Input() loggedOutTime: number;
  message = false;

  constructor() {}

  sendLogoutMessage() {
    this.logoutEvent.emit(this.message);
  }
}
