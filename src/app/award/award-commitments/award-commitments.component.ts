import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-award-commitments',
  templateUrl: './award-commitments.component.html',
  styleUrls:['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
})
export class AwardCommitmentsComponent implements OnInit {
  showRates: boolean = true;
  showCostsahring: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  showRatesTab(event: any) {
    event.preventDefault();
    this.showRates = !this.showRates;
}

  showCostsahringTab(event: any) {
    event.preventDefault();
    this.showCostsahring = !this.showCostsahring;
}

}
