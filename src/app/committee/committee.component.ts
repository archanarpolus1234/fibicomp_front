import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteeHomeComponent } from './committee-home/committee-home.component';

import { CommitteCreateEditService } from './committee-create-edit.service';
import { CommitteeSaveService } from './committee-save.service';
import { CompleterService, CompleterData } from 'ng2-completer';
import { CommitteeConfigurationService } from '../common/committee-configuration.service';


@Component( {
    selector: 'app-committee',
    templateUrl: './committee.component.html',
    providers: [CommitteCreateEditService, CommitteeSaveService],
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
} )

export class CommitteeComponent {
    currentTab: string = 'committee_home';
    schedule: boolean = false;
    mode: string;
    class: string;
    id: string;
    name: string;
    type: string;
    homeUnit: string;
    lastUpdated: string;
    homeUnits: any = [];
    reviewTypes: any = [];
    result: any = {};
    homeUnitInput: any = [];
    editDetails: boolean = false;
    homeUnitName: string;
    editFlag: boolean = false;
    constantClass: string;
    areaList: any = [];
    showPopup = false;
    middleOfEdit = false;
    middleOfSave= false;
    alertMsgNotSaved: string = '';
    alertMsgMiddleOfEdit: string = '';
    @ViewChild('homeComponent') committeeHome;
    public dataServiceHomeUnit: CompleterData;

    constructor( public route: ActivatedRoute, public router: Router, public committeCreateService: CommitteCreateEditService, private completerService: CompleterService, public committeeSaveService: CommitteeSaveService, public committeeConfigurationService: CommitteeConfigurationService ) {
        this.result.committee = {};
        this.result.committee.committeeType = {};
        this.mode = this.route.snapshot.queryParamMap.get( 'mode' );
        this.id = this.route.snapshot.queryParamMap.get( 'id' );
        this.initLoadParent();
    }

    initLoadParent() {
        if ( this.mode == 'create' ) {
            this.editFlag = true;
            this.committeCreateService.getCommitteeData( '1' )
                .subscribe( data => {
                    this.result = data || [];
                    if ( this.result != null ) {
                        this.homeUnits = this.result.homeUnits;
                        this.committeeConfigurationService.changeCommmitteeData( this.result );
                        this.homeUnitInput.unitName = this.result.committee.homeUnitName;
                        this.reviewTypes = this.result.reviewTypes;
                        this.areaList = this.completerService.local( this.result.researchAreas, 'description', 'description' );
                        this.dataServiceHomeUnit = this.completerService.local( this.homeUnits, 'unitName', 'unitName' );
                    }
                } );
            this.committeeConfigurationService.changeMode( this.mode );
            this.editDetails = true;
            this.class = 'scheduleBoxes';
            this.constantClass = 'scheduleBoxes';
            this.homeUnitInput.unitName = '';
        }
        else if ( this.mode == 'view' ) {
            this.committeCreateService.loadCommittee( this.id )
                .subscribe( data => {
                    this.result = data || [];
                    if ( this.result != null ) {
                        var ts = new Date( this.result.committee.updateTimestamp );
                        let month = String( ts.getMonth() + 1 );
                        let day = String( ts.getDate() );
                        const year = String( ts.getFullYear() );
                        if ( month.length < 2 ) month = '0' + month;
                        if ( day.length < 2 ) day = '0' + day;
                        this.lastUpdated = `${day}/${month}/${year}` + " by " + this.result.committee.updateUser;
                        this.homeUnits = this.result.homeUnits;
                        this.committeeConfigurationService.changeCommmitteeData( this.result );
                        this.homeUnitInput.unitName = this.result.committee.homeUnitName;
                        this.reviewTypes = this.result.reviewTypes;
                        this.areaList = this.completerService.local( this.result.researchAreas, 'description', 'description' );
                        this.dataServiceHomeUnit = this.completerService.local( this.homeUnits, 'unitName', 'unitName' );
                    }
                } );
            this.committeeConfigurationService.changeMode( this.mode );
            this.editDetails = false;
            this.class = 'committeeBoxNotEditable';
            this.constantClass = 'committeeBoxNotEditable';
        }

    }

    show_current_tab( e: any, current_tab ) {
        e.preventDefault();
        this.clear();
        if ( current_tab == 'committee_members' ) {
            if ( this.editFlag ) {
                this.showPopup = true;
                if ( this.mode == 'view' ) {
                    this.middleOfEdit = true;
                    this.alertMsgMiddleOfEdit = 'You are in the middle of editing Committee Details, Do you want to stay on the page..?';
                }
                else if ( this.mode == 'create' ) {
                    this.middleOfSave = true;
                    this.alertMsgNotSaved = 'You have to save the committee to proceed!';
                }
            }
            else{
                this.currentTab = current_tab;
            }
        }
        else{
            this.currentTab = current_tab;
        }
    }

    saveAndContinue(){
        this.editFlag = !this.editFlag;
        this.class = "committeeBoxNotEditable";
        this.currentTab = 'committee_members';
        this.clear();
        this.committeeHome.saveDetails();
    }

    clear(){
        this.showPopup = false;
        this.middleOfEdit = false;
        this.alertMsgMiddleOfEdit = ''; 
        this.middleOfSave = false;
        this.alertMsgNotSaved = '';
    }

    homeChangeFunction( unitName ) {
        this.homeUnits.forEach(( value, index ) => {
            if ( value.unitName == unitName ) {
                this.result.committee.homeUnitNumber = value.unitNumber;
            }
        } );
    }

    onHomeSelect() {
        this.homeUnits.forEach(( value, index ) => {
            if ( value.unitName == this.result.committee.homeUnitName ) {
                this.result.committee.homeUnitNumber = value.unitNumber;
            }
        } );
    }

    recieveFlag( $event ) {
        this.editFlag = $event;
        if ( this.editFlag ) {
            this.class = 'scheduleBoxes';
        } else {
            this.class = 'committeeBoxNotEditable';
        }
    }

    recievemode( $event ) {
        this.mode = $event;
        this.committeeConfigurationService.currentCommitteeData.subscribe( data => {
            this.result = data;
            this.id = this.result.committee.committeeId;
        });
        
        if ( this.mode == 'view' ) {
            this.initLoadParent();
            this.editDetails = false;
            this.class = 'committeeBoxNotEditable';
            this.constantClass = 'committeeBoxNotEditable';
        }
    }
}
