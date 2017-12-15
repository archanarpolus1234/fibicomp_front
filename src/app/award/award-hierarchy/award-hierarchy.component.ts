import { Component, OnInit } from '@angular/core';
import { AwardHierarchyService } from './award-hierarchy.service';
import { AwardSummaryService } from '../award-home/award-summary.service';
import { ActivatedRoute } from '@angular/router';
@Component( {
    selector: 'app-award-hierarchy',
    templateUrl: './award-hierarchy.component.html',
    styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
} )
export class AwardHierarchyComponent implements OnInit {
    result: any = {};
    list: any = {};
    private awardNumber: string;
    private rootAwardNumber: string;
    private parentAwardNumber: string;
    private awardId: string;
    private activityType: string;
    private awardType: string;
    private accountType: string;
    private sponsorAwardNumber: string;
    private awardTitle: string;
    private awardEffectiveDate: string;
    private obligationStartDate: string;
    private obligationEndDate: string;
    private noticeDate: string;
    private obligatedAmount: string;
    private anticipatedAmount: string;

    constructor( private awardHierarchyService: AwardHierarchyService, private awardSummaryService: AwardSummaryService, private route: ActivatedRoute ) { }

    ngOnInit() {
        this.awardId = this.route.snapshot.queryParams['awardId'];
        this.awardSummaryService.loadAwardSummary( this.awardId ).subscribe( data => {
        this.result = data || [];
        if ( this.result != null ) {
            this.awardNumber = this.result.awardDetails[0].award_number;
            this.rootAwardNumber = this.result.awardDetails[0].root_award_number;
            this.awardHierarchyService.loadAwardHierarchy( this.rootAwardNumber, this.awardNumber ).subscribe( data => {
                this.result = data || [];
                if ( this.result != null ) {
                    this.awardDetailsFetching( this.awardId );
                    this.list = Array.of( this.result.awardHierarchy );
        
                }
            } );

            }
        } );
    }

    awardDetailsFetching( awardId: string ) {
        this.awardSummaryService.loadAwardSummary( awardId ).subscribe( data => {
            this.result = data || [];
            if ( this.result != null ) {
                this.activityType = this.result.awardDetails[0].activity_type;
                this.awardType = this.result.awardDetails[0].award_type;
                this.accountType = this.result.awardDetails[0].account_type;
                this.sponsorAwardNumber = this.result.awardDetails[0].sponsor_award_number;
                this.awardTitle = this.result.awardDetails[0].title;
                this.awardEffectiveDate = this.result.awardDetails[0].award_effective_date;
                this.obligationStartDate = this.result.awardDetails[0].obligation_start;
                this.obligationEndDate = this.result.awardDetails[0].obligation_end;
                this.noticeDate = this.result.awardDetails[0].notice_date;
                this.obligatedAmount = this.result.awardDetails[0].obligated_amount;
                this.anticipatedAmount = this.result.awardDetails[0].anticipated_amount;
    
            }
        } );
    }
    
    awardClickDetails( awardId, e: Event ) {
        e.preventDefault();
        this.awardSummaryService.loadAwardSummary( awardId ).subscribe( data => {
            this.result = data || [];
            if ( this.result != null ) {
                this.activityType = this.result.awardDetails[0].activity_type;
                this.awardType = this.result.awardDetails[0].award_type;
                this.accountType = this.result.awardDetails[0].account_type;
                this.sponsorAwardNumber = this.result.awardDetails[0].sponsor_award_number;
                this.awardTitle = this.result.awardDetails[0].title;
                this.awardEffectiveDate = this.result.awardDetails[0].award_effective_date;
                this.obligationStartDate = this.result.awardDetails[0].obligation_start;
                this.obligationEndDate = this.result.awardDetails[0].obligation_end;
                this.noticeDate = this.result.awardDetails[0].notice_date;
                this.obligatedAmount = this.result.awardDetails[0].obligated_amount;
                this.anticipatedAmount = this.result.awardDetails[0].anticipated_amount;
    
            }
        } );
    }
}
