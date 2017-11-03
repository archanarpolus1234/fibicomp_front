import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-timeoutmodal',
  templateUrl: './timeoutModal.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/style.css']
})

export class TimeoutModalComponent {
  @Output() logoutEvent = new EventEmitter<boolean>();
  @Input() loggedOutTime: number;
  message: boolean = false;
  
  constructor() { }
  
  sendLogoutMessage() { 
      this.logoutEvent.emit(this.message);
  }
}
