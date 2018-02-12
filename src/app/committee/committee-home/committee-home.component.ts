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
    public dataServiceArea: any =[];
    @Input() Id: string;
    @Input() Name: string;
    @Input() Type: string;
    @Input() Unit: string;
    @Input() unitName: string;
    @Output() editFlag = new EventEmitter<boolean>();
    @Output() modeFlag = new EventEmitter<String>();
    @Input() reviewTypes: any[];
    @Input() areaList: any = [];
    result: any = {};
    resultSave: any = {};
    sendObject: any;
    pattern = [0-9];
    addResearchArea :string;
    
    showGenerateSchedule:boolean = false;
    committeeData: any = {};
    scheduleData:any = {};
    sendScheduleRequestData:any;
    optionDay: string = 'XDAY';
    currentScheduleTab: string = 'DAILY';
    editSchedule = {};
    editScheduleClass: string = 'committeeBoxNotEditable';


    constructor( public route: ActivatedRoute, public router: Router, private completerService: CompleterService, public committeeSaveService: CommitteeSaveService, private committeeConfigurationService: CommitteeConfigurationService ) {
        this.mode = this.route.snapshot.queryParamMap.get( 'mode' );
        this.initialLoadChild();
    }

    ngOnInit() {
    }

    initialLoadChild() {
        this.committeeConfigurationService.currentCommitteeData.subscribe( data => {
            this.result = data;
          if( this.result != null ){
              
              if(this.result.committee == null || this.result.committee == undefined) {
                  this.committeeData.committee = {};
              } else {
                  this.committeeData.committee = this.result.committee;
              }
              if(this.result.committee.committeeSchedules == null || this.result.committee.committeeSchedules== undefined) {
                  this.committeeData.committee.committeeSchedules = [];
              } else {
                  this.committeeData.committee.committeeSchedules = this.result.committee.committeeSchedules;
              }
              if ( this.result.scheduleData == null ) {
                  this.result.scheduleData = {};
                  this.result.scheduleData.time = {};
                  this.result.scheduleData.dailySchedule = {};
                  this.result.scheduleData.recurrenceType = 'DAILY';
                  if(this.optionDay == 'XDAY') {
                      this.result.scheduleData.dailySchedule.day = 1;
                  }
              }
              
            if ( this.mode == 'view' ) {
                this.errorFlag = false;
                this.editDetails = false;
                this.editFlag.emit( this.editDetails );
                this.Id = this.result.committee.committeeId;
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
            }
            else {
                this.editClass = 'scheduleBoxes';
                this.editAreaClass = 'scheduleBoxes';
                this.editDetails = true;
            }
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
        if ( ( this.result.committee.minimumMembersRequired == undefined || this.result.committee.advSubmissionDaysReq == undefined || this.result.committee.maxProtocols == undefined || this.Id == undefined || this.Type == undefined || this.Name == undefined || this.unitName == undefined ) || ( this.result.committee.reviewTypeDescription == 'Select' ) ) {
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
            this.result.updateType = 'SAVE';
            this.result.currentUser = 'admin';
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
                this.committeeConfigurationService.changeCommmitteeData( this.result );
                if ( this.mode == 'create' ) {
                    this.saveCommitteeFlag = true;
                }
            } );
            if(this.mode == 'view'){
                this.initialLoadChild();
            }
            else{
                this.mode= 'view';
                this.modeFlag.emit( this.mode );
                this.initialLoadChild();
            }
        }
    }

    cancelEditDetails() {
        if(this.mode == 'view'){
            this.editDetails = !this.editDetails;
            this.editFlag.emit( this.editDetails );
            if ( !this.editDetails ) {
                this.editClass = 'committeeBoxNotEditable';
            }
            this.result.committee.committeeId = this.Id;
            this.result.committee.committeeType.description = 'IRB'; 
            this.result.committee.committeeName =  this.Name;
            this.result.committee.homeUnitName = this.unitName;
            this.result.committee.homeUnitNumber = this.Unit;
            this.result.committee.reviewTypeDescription = this.reviewType;
            this.result.committee.description = this.description;
            this.result.committee.minimumMembersRequired = this.minMembers;
            this.result.committee.advSubmissionDaysReq = this.advSubDays;
            this.result.committee.maxProtocols = this.maxProtocols;
        }
        else{
            this.result.committee.committeeId = '';
            this.result.committee.committeeType.description = ''; 
            this.result.committee.committeeName = '';
            this.result.committee.homeUnitName = '';
            this.result.committee.reviewTypeDescription = '';
            this.result.committee.description = '';
            this.result.committee.minimumMembersRequired = '';
            this.result.committee.advSubmissionDaysReq = '';
            this.result.committee.maxProtocols = '';
            this.router.navigate(['/committee'], { queryParams: { mode: 'create' } });
        }
    }

    addAreaOfResearch( Object ) {
        this.showSaveAreaOfResearch = true;
        this.addResearchArea = '0';
        this.editAreaClass = 'committeeBoxNotEditable';
        for ( let i = 0;  i<this.result.committee.researchAreas.length; i++ ) {
            if ( Object.researchAreaCode ==  this.result.committee.researchAreas[i].researchAreaCode ) {
                this.addResearchArea = '1';
            }
        }
        if(this.addResearchArea == '1'){
            alert("Cannot add  Research area since it is already there in the committee!");
        }
        else{
            this.result.committee.researchAreas.push(Object);
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
    }

    onAreaSelect() {
        this.areaList._data.forEach(( value, index ) => {
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
            this.committeeConfigurationService.changeCommmitteeData( this.result );
        } );
        this.initialLoadChild();
        this.deleteResearch = false;
    }
   
    deleteAreaOfResearch( $event, Id, code) {
        event.preventDefault();
        if(this.result.committee.researchAreas.length!=null && Id!=undefined){

            this.committeeSaveService.deleteAreaOfResearch( Id ).subscribe( data => {
                
            } );
        }
       for ( let i = 0; i < this.result.committee.researchAreas.length; i++ ) {
                    if ( code == this.result.committee.researchAreas[i].researchAreaCode ) {
                        this.result.committee.researchAreas.splice( i, 1 );
                    }
                } 
        this.committeeConfigurationService.changeCommmitteeData( this.result );
        this.initialLoadChild();
        this.deleteResearch = true;
    }
    
    showSchedulePopUp() {
        if(this.showGenerateSchedule == false) {
            this.showGenerateSchedule = true;
        }
    }
    
    showTab(recurrenceType) {
        this.result.scheduleData.recurrenceType = recurrenceType;
    }

    sentDayOption() {
        setTimeout(() => {
                    if(this.optionDay == 'XDAY') {
                        this.result.scheduleData.dailySchedule.day = 1;
                    } else {
                        this.result.scheduleData.dailySchedule.day = "";
                    }
               }, 100);
    }
    
    generateSchedule() {
        this.result.scheduleData.time.meridiem = "AM";
        this.result.scheduleData.dailySchedule.dayOption = this.optionDay;
        this.sendScheduleRequestData = {};
        this.sendScheduleRequestData.committee = this.result.committee;
        this.sendScheduleRequestData.scheduleData = this.result.scheduleData;
        this.committeeSaveService.saveScheduleData( this.sendScheduleRequestData ).subscribe( data => {
            this.committeeData = data || [];
        } );
    }
    
    editScheduleData(e, i) {
        e.preventDefault();
        this.editSchedule[i] = !this.editSchedule[i];
    }
    
    deleteScheduleData(e, scheduleId) {
        e.preventDefault();
        this.committeeSaveService.deleteScheduleData( scheduleId ).subscribe( data => {
            this.committeeData = data || [];
        } );
    }
    
    updateScheduleData(e, i) {
        e.preventDefault();
        this.editSchedule[i] = !this.editSchedule[i];
    }
    
    cancelEditSchedule(e, i) {
        e.preventDefault();
        this.editSchedule[i] = !this.editSchedule[i];
    }
}
