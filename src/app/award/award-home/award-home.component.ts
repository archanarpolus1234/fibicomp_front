import { Component, OnInit } from '@angular/core';
import {AwardSummaryService} from './award-summary.service';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-award-home',
  templateUrl: './award-home.component.html',
  styleUrls:['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
})
export class AwardHomeComponent implements OnInit {
    awardId:string;
    result: any = {};
    awardPersons={};
    awardSponsorContacts={};
    awardUnitContacts={};
    awardSpecialReviews={};
    awardFundedProposals={};
    private lastUpdate:any;
    private activityType:string;
    private awardType:string;
    private accountType:string;
    private sponsorAwardNumber:string;
    private awardTitle:string;
    private awardEffectiveDate:string;
    private obligationStartDate:string;
    private obligationEndDate:string;
    private noticeDate:string;
    private obligatedAmount:string;
    private anticipatedAmount:string;
    private contactRoleCode:string;
    private unitNumber:string;
    private fullName:string;
    private unitName:string;

    constructor(public awardSummaryService:AwardSummaryService,private route: ActivatedRoute) {
    }

   ngOnInit() {
          this.awardId = this.route.snapshot.queryParams['awardId'];
          this.awardSummaryService.loadAwardSummary(this.awardId).subscribe(data=>{
              this.result = data || [];
              if ( this.result != null ) {
                  this.activityType=this.result.awardDetails[0].activity_type;
                  this.awardType=this.result.awardDetails[0].award_type;
                  this.accountType=this.result.awardDetails[0].account_type;
                  this.sponsorAwardNumber=this.result.awardDetails[0].sponsor_award_number;
                  this.awardTitle=this.result.awardDetails[0].title;
                  this.awardEffectiveDate=this.result.awardDetails[0].award_effective_date;
                  this.obligationStartDate=this.result.awardDetails[0].obligation_start;
                  this.obligationEndDate=this.result.awardDetails[0].obligation_end;
                  this.noticeDate=this.result.awardDetails[0].notice_date;
                  this.obligatedAmount=this.result.awardDetails[0].obligated_amount;
                  this.anticipatedAmount=this.result.awardDetails[0].anticipated_amount;
                  this.awardPersons=this.result.awardPersons;
                  this.awardSponsorContacts=this.result.awardSponsorContact;
                  this.awardUnitContacts=this.result.awardUnitContact;
                  this.awardSpecialReviews=this.result.awardSpecialReviews;
                  this.awardFundedProposals=this.result.awardFundedProposals;
              }
     });
   }
}
