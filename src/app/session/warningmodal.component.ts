import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-display-dialog',
  templateUrl: 'warningmodal.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/style.css']
})

export class WarningModalComponent {
  @Output() continueEvent = new EventEmitter<boolean>();
  @Output() logoutEvent = new EventEmitter<boolean>();
  @Input() timeToExitinMin: number;
  @Input() timeToExitinSec: number;
  message: boolean = false;
  
  constructor() { }
  sendContinueMessage() { 
      this.continueEvent.emit(this.message);
   }
  sendLogoutMessage() { 
      this.logoutEvent.emit(this.message);
      }
}
