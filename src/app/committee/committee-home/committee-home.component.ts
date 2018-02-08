import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommitteCreateEditService } from '../committee-create-edit.service';
import { CommitteeSaveService } from '../committee-save.service';
import { CompleterService, CompleterData } from 'ng2-completer';
import { CommitteeConfigurationService } from '../../common/committee-configuration.service';

@Component( {
    selector: 'app-committee-home',
    templateUrl: './committee-home.component.html',
    providers: [CommitteeSaveService],
    styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],
} )

export class CommitteeHomeComponent implements OnInit {
    addResearch: boolean = false;
    editDetails: boolean = false;
    editResearch: boolean = false;
    deleteResearch = false;
    showSaveAreaOfResearch = false;
    reviewType: string;
    description: string;
    minMembers: string;
    advSubDays: string;
    errorFlag: boolean;
    saveCommitteeFlag = false;
    error = '';
    addArea = '';
    areaOfReasearch: any[] = [];
    editClass: string;
    editAreaClass: string;
    maxProtocols: string;
    mode: string;
    public areaInput: any = {};
    slNo: number = 0;
    public researchArea: any = {};
    public dataServiceArea: CompleterData;
    @Input() Id: string;
    @Input() Name: string;
    @Input() Type: string;
    @Input() Unit: string;
    @Input() unitName: string;
    @Output() editFlag = new EventEmitter<boolean>();
    @Input() reviewTypes: any[];
    @Input() areaList: any[];
    result: any = {};
    resultSave: any = {};
    sendObject: any;


    constructor( public route: ActivatedRoute, public router: Router, private completerService: CompleterService, public committeeSaveService: CommitteeSaveService, private committeeConfigurationService: CommitteeConfigurationService ) {
        this.mode = this.route.snapshot.queryParamMap.get( 'mode' );
        this.initialLoadChild();
    }

    ngOnInit() {
        debugger;
    }

    initialLoadChild() {
        this.committeeConfigurationService.currentCommitteeData.subscribe( data => {
            this.result = data;
            if ( this.mode == 'view' ) {
                this.errorFlag = false;
                this.Name = this.result.committee.committeeName;
                this.unitName = this.result.homeUnitName;
                this.Unit = this.result.homeUnitNumber;
                this.editClass = 'committeeBoxNotEditable';
                this.editAreaClass = 'committeeBoxNotEditable';
                this.reviewType = this.result.committee.reviewTypeDescription;
                this.description = this.result.committee.description;
                this.minMembers = this.result.committee.minimumMembersRequired;
                this.advSubDays = this.result.committee.advSubmissionDaysReq;
                this.maxProtocols = this.result.committee.maxProtocols;
                this.saveCommitteeFlag = true;
                /*
                 this.reviewTypes = this.result.reviewTypes;
                 this.areaList = this.result.researchAreas;*/
                //this.areaOfReasearch = this.result.committee.researchAreas;
                //  this.dataServiceArea = this.completerService.local( this.areaList, 'description', 'description' );
            }
            else {
                this.editClass = 'scheduleBoxes';
                this.editAreaClass = 'scheduleBoxes';
                this.editDetails = true;
                // this.dataServiceArea = this.completerService.local(this.areaList, 'description', 'description' );
            }
        } );
    }

    showaddAreaOfResearch() {
        this.addResearch = !this.addResearch;
        this.editResearch = !this.editResearch;
        if ( this.editResearch ) {
            this.editAreaClass = 'scheduleBoxes';
        }
    }

    showEditDetails() {
        this.editDetails = !this.editDetails;
        if ( this.editDetails ) {
            this.editClass = 'scheduleBoxes';
        }
        this.editFlag.emit( this.editDetails );
    }

    saveDetails() {
        if ( ( this.minMembers == undefined || this.advSubDays == undefined || this.maxProtocols == undefined || this.Id == undefined || this.Type == undefined || this.Name == undefined || this.unitName == undefined ) || ( this.reviewType == 'Select' ) ) {
            this.errorFlag = true;
            this.error = 'please fill all the mandatory fileds';
        }
        else {
            this.error = '';
            this.result.committee.committeeId = this.Id;
            this.result.committee.committeeName = this.Name;
            this.result.committee.committeeType.committeeTypeCode = '1';
            this.result.committee.homeUnitNumber = this.Unit;
            this.result.committee.homeUnitName = this.unitName;
            this.result.committee.description = this.description;
            this.result.committee.minimumMembersRequired = this.minMembers;
            this.result.committee.maxProtocols = this.maxProtocols;
            this.result.committee.advSubmissionDaysReq = this.advSubDays;
            this.result.updateType = 'SAVE';
            this.result.currentUser = 'admin';
            /* this.result.homeUnits = [];
             this.result.reviewTypes = [];
             this.result.researchAreas = [];*/
            /* if ( this.areaOfReasearch != [] ) {
                 this.areaOfReasearch.forEach(( value, index ) => {
                     this.result.committee.researchAreas.push( this.areaOfReasearch[index] );
                 } );
               
             }*/
            this.editDetails = !this.editDetails;
            this.editFlag.emit( this.editDetails );
            if ( this.editDetails == false ) {
                this.editClass = 'committeeBoxNotEditable';
            }
            this.reviewTypes.forEach(( value, index ) => {
                if ( value.description == this.reviewType ) {
                    this.result.committee.applicableReviewTypecode = value.reviewTypeCode;
                    this.result.committee.reviewTypeDescription = value.description;
                }
            } );
            this.committeeSaveService.saveCommitteeData( this.result ).subscribe( data => {
                this.result = data || [];
                if ( this.mode == 'create' ) {
                    this.saveCommitteeFlag = true;
                }
            } );
            this.initialLoadChild();
        }
    }

    cancelEditDetails() {
        this.editDetails = !this.editDetails;
        this.editFlag.emit( this.editDetails );
        this.initialLoadChild();
        if ( !this.editDetails ) {
            this.editClass = 'committeeBoxNotEditable';
        }
    }

    addAreaOfResearch( Object ) {
        this.showSaveAreaOfResearch = true;
        this.editAreaClass = 'committeeBoxNotEditable';
        this.result.committee.researchAreas.push( Object );
        for ( let i = 0; i < this.areaList.length; i++ ) {
            if ( Object.researchAreaDescription == this.areaList[i].description ) {
                this.areaList.splice( i, 1 );
            }
        }
        this.areaInput = {};
    }

    showEditResearch() {
        this.editResearch = !this.editResearch;
        if ( this.editResearch ) {
            this.editAreaClass = 'scheduleBoxes';
        }
    }

    areaChangeFunction( researchAreaDescription ) {
        debugger;
        this.dataServiceArea = this.completerService.local( this.areaList, 'description', 'description' );
        this.areaList.forEach(( value, index ) => {
            if ( value.description == researchAreaDescription ) {
                this.areaInput.researchAreaCode = value.researchAreaCode;
            }
        } );
    }

    onAreaSelect() {
        this.areaList.forEach(( value, index ) => {
            if ( value.description == this.areaInput.researchAreaDescription ) {
                this.areaInput.researchAreaCode = value.researchAreaCode;
                this.areaInput.researchAreaDescription = value.description;
                this.areaInput.updateUser = 'admin';
                this.areaInput.updateTimestamp = new Date().getTime();
            }
        } );
    }

    saveAreaOfResearch() {
        this.sendObject = {};
        this.sendObject.committee = this.result.committee;
        this.committeeSaveService.saveResearchAreaCommitteeData( this.sendObject ).subscribe( data => {
            this.result = data || [];
        } );
        this.initialLoadChild();
        this.deleteResearch = false;
    }
    deleteAreaOfResearch( $event, code ) {
        event.preventDefault();
        for ( let i = 0; i < this.result.committee.researchAreas.length; i++ ) {
            if ( code == this.result.committee.researchAreas[i].researchAreaCode ) {
                this.result.committee.researchAreas.splice( i, 1 );
            }
        }
        this.initialLoadChild();
        this.deleteResearch = true;
    }
}
