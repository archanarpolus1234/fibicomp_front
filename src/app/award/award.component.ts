import { Component } from '@angular/core';
import {AwardSummaryService} from './award-home/award-summary.service';
import {ActivatedRoute} from '@angular/router';
@Component( {
    templateUrl: 'award.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
} )

export class AwardComponent {
    currentTab: string = 'award_home';
    private awardId:string;
    private awardNumber:string;
    private sponsorName:string;
    private leadUnitName:string
    private accountNumber:string;
    private awardStatus:string;
    private lastUpdate:string;
    result: any = { };

	constructor(private awardSummaryService:AwardSummaryService,private route: ActivatedRoute) {

	}
	
    ngOnInit() {
        this.awardId = this.route.snapshot.queryParams['awardId'];
        this.awardSummaryService.loadAwardSummary(this.awardId).subscribe(data=>{
            this.result = data || [];
            if ( this.result != null ) {
                 this.awardNumber=this.result.awardDetails[0].award_number;
                 this.accountNumber=this.result.awardDetails[0].account_number;
                 this.leadUnitName=this.result.awardDetails[0].lead_unit_name;
                 this.awardStatus=this.result.awardDetails[0].award_status;
                 this.sponsorName=this.result.awardDetails[0].sponsor_name;
                 this.lastUpdate=this.result.awardDetails[0].last_update;
             
                }
        });
    }

	show_current_tab( e: any, current_tab ) {
        e.preventDefault();
        this.currentTab = current_tab;
    }

}