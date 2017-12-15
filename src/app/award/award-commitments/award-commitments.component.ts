import { Component, OnInit } from '@angular/core';
import { AwardCommitmentsService } from './award-commitments.service';
import { ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-award-commitments',
  templateUrl: './award-commitments.component.html',
  styleUrls:['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
})
export class AwardCommitmentsComponent implements OnInit {
  showRates: boolean = true;
  showCostsahring: boolean = true;
  awardId: string;
  result : any ={};
  constructor(private awardCommitmentsService: AwardCommitmentsService,private route: ActivatedRoute) { }

  ngOnInit() {
      this.awardId = this.route.snapshot.queryParamMap.get('awardId');
      this.awardCommitmentsService.loadCostsharingDetails(this.awardId)
      .subscribe(data=>{
          this.result = data;
          console.log(this.result);
      })
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
