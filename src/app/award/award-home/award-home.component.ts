import { Component, OnInit } from '@angular/core';
import { AwardSummaryService } from './award-summary.service';
import { ActivatedRoute } from '@angular/router';
import { AwardComponent } from '../award.component';

import {AwardconfigurationService} from '../../award/awardconfiguration.service';

@Component( {
    selector: 'app-award-home',
    templateUrl: './award-home.component.html',
    styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
} )
export class AwardHomeComponent implements OnInit {
    awardId: string;
    result: any = {};
    public awardNumber: string;
    awardPersons: any[] = [];
    awardSponsorContacts: any[] = [];
    awardUnitContacts: any[] = [];
    awardSpecialReviews: any[] = [];
    awardFundedProposals: any[] = [];

    noAwardDetails: boolean = false;
    noAwardPersons: boolean = false;
    noAwardSponsorContacts: boolean = false;
    noAwardUnitContacts: boolean = false;
    noAwardSpecialReviews: boolean = false;
    noAwardFundedProposal: boolean = false;

    public lastUpdate: any;
    public activityType: string;
    public awardType: string;
    public accountType: string;
    public sponsorAwardNumber: string;
    public awardTitle: string;
    public awardEffectiveDate: string;
    public obligationStartDate: string;
    public obligationEndDate: string;
    public noticeDate: string;
    public obligatedAmount: string;
    public anticipatedAmount: string;
    public contactRoleCode: string;
    public unitNumber: string;
    public fullName: string;
    public unitName: string;
    public pi_coiTrigger = false;
    public kpTrigger = false;

    constructor( public awardComponent: AwardComponent, public awardSummaryService: AwardSummaryService, public route: ActivatedRoute, private awardconfigurationService: AwardconfigurationService ) {
    }

    ngOnInit() {
        this.awardId = this.route.snapshot.queryParams['awardId'];
            this.awardconfigurationService.currentAwardData.subscribe(data=>{
            this.result = data || [];
            if ( this.result != null ) {
                if ( this.result.awardDetails.length == 0 ) {
                    this.noAwardDetails = true;
                }
                if ( this.result.awardPersons.length == 0 ) {
                    this.noAwardPersons = true;
                }
                if ( this.result.awardSponsorContact.length == 0 ) {
                    this.noAwardSponsorContacts = true;
                }
                if ( this.result.awardUnitContact.length == 0 ) {
                    this.noAwardUnitContacts = true;
                }
                if ( this.result.awardFundedProposals.length == 0 ) {
                    this.noAwardFundedProposal = true;
                }
                if ( this.result.awardSpecialReviews.length == 0 ) {
                    this.noAwardSpecialReviews = true;
                }
                this.activityType = this.result.awardDetails[0].activity_type;
                this.awardNumber = this.result.awardDetails[0].award_number;
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
                this.awardPersons = this.result.awardPersons;
                this.awardSponsorContacts = this.result.awardSponsorContact;
                this.awardUnitContacts = this.result.awardUnitContact;
                this.awardSpecialReviews = this.result.awardSpecialReviews;
                this.awardFundedProposals = this.result.awardFundedProposals;

                for ( let i = 0; i < this.awardPersons.length; i++ ) {
                    if ( this.awardPersons[i].contact_role_code == 'PI' || this.awardPersons[i].contact_role_code == 'COI' ) {
                        this.pi_coiTrigger = true;
                    }
                    else if ( this.awardPersons[i].contact_role_code == 'KP' ) {
                        this.kpTrigger = true;
                    }
                }
            }
        } );
    }
}
