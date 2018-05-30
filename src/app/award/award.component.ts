import { Component } from '@angular/core';
import { AwardSummaryService } from './award-home/award-summary.service';
import { ActivatedRoute } from '@angular/router';
import { AwardHierarchyService } from '../award/award-hierarchy/award-hierarchy.service';
import { Constants } from '../constants/constants.service';
import {AwardconfigurationService} from '../award/awardconfiguration.service';
import { Subscription } from "rxjs/Subscription";

@Component( {
    templateUrl: 'award.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
} )

export class AwardComponent {
    currentTab: string = 'award_home';
    public awardId: string;
    public awardNumber: string;
    public sponsorName: string;
    public leadUnitName: string
    public accountNumber: string;
    public awardStatus: string;
    public lastUpdate: string;
    result: any = {};
    outputPath: string;
    outputPathAB: string;
    userName: string;
    documentNumber: string;
    public currentValueSub : Subscription;
    public loadAwardSub : Subscription;
    public is_awd_budget: string = 'F';
    public latest_version_number: string;
    
    constructor( public awardSummaryService: AwardSummaryService, public route: ActivatedRoute, public awardHierarchyService: AwardHierarchyService, private constant: Constants, public awardconfigurationService: AwardconfigurationService ) {
        this.outputPath = this.constant.outputPath;
        this.outputPathAB = this.constant.outputPathAB;
    }

    ngOnInit() {
       this.currentValueSub = this.awardHierarchyService.currentvalue.subscribe( data => {
            this.currentTab = data;
        } );
        this.awardId = this.route.snapshot.queryParams['awardId'];
        this.loadAwardSub = this.awardSummaryService.loadAwardSummary( this.awardId ).subscribe( data => {
            this.result = data || [];
            if ( this.result.length !== 0 && this.result.awardDetails !== undefined && this.result.awardPersons !== undefined) {
                this.awardconfigurationService.changeAwardData(this.result);
                this.userName = this.result.awardPersons[0].user_name;
                this.awardNumber = this.result.awardDetails[0].award_number;
                this.accountNumber = this.result.awardDetails[0].account_number;
                this.leadUnitName = this.result.awardDetails[0].lead_unit_name;
                this.awardStatus = this.result.awardDetails[0].award_status;
                this.sponsorName = this.result.awardDetails[0].sponsor_name;
                this.lastUpdate = this.result.awardDetails[0].last_update;
                this.documentNumber = this.result.awardDetails[0].document_number;           
                this.is_awd_budget = this.result.awardDetails[0].is_awd_budget;
                this.latest_version_number = this.result.awardDetails[0].latest_version_number;
            }
        } );
    }

    show_current_tab( e: any, current_tab ) {
        e.preventDefault();
        this.currentTab = current_tab;
    }
    ngOnDestroy() {
        this.currentValueSub.unsubscribe();
        this.loadAwardSub.unsubscribe();
    }
}
