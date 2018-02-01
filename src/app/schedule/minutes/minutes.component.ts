import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
})
export class MinutesComponent implements OnInit {
  addMinutesEntry: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  addMinutes($event){
      this.addMinutesEntry = !this.addMinutesEntry;
  }
}
