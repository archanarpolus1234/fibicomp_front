import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ScheduleConfigurationService } from "../../../common/schedule-configuration.service";
import { CommitteeMemberNonEmployeeElasticService } from "../../../elastic-search/committee-members-nonEmployee-elastic-search.service";
import { CommitteeMemberEmployeeElasticService } from "../../../elastic-search/committee-members-employees-elastic-search.service";
import { ScheduleAttendanceService } from "./schedule-attendance.service";

@Component( {
    selector: 'app-schedule-attendance',
    templateUrl: './schedule-attendance.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css', '../../../../assets/css/font-awesome.min.css', '../../../../assets/css/style.css', '../../../../assets/css/search.css']
} )
export class ScheduleAttendanceComponent implements OnInit, AfterViewInit {
    result: any = {};
    showCommentFlag: boolean = false;
    presentFlag: boolean = false;
    attendanceIndex: number;
    commentsIndex: number;
    searchText: FormControl = new FormControl( '' );
    nonEmployeeFlag: boolean = false;
    message: string;
    showAddMember: boolean = false;

    elasticSearchresults: any = [];
    searchString: string;
    hits_source;
    hits_highlight: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    organization: string;
    prncpl_id: string;
    full_name: string;
    prncpl_nm: string;
    email_addr: string;
    unit_number: string;
    unit_name: string;
    addr_line_1: string;
    phone_nbr: string;
    rolodexId: string;
    searchTextModel: string;
    _results: Subject<Array<any>> = new Subject<Array<any>>();
    activeMembers = true;
    inactiveMembers: string;
    searchActive: boolean = false;
    iconClass: string = 'fa fa-search';
    selectedMember: any = {};

    guestMemberObj: any = {};
    updatingMemberObj: any = {};
    scheduleId: number;
    committeeId: string;
    attendanceShowFlag: boolean = false;
    editFlagEnabled = {};
    editIndex: number;
    tempAlternateFor: string;
    tempMemberPresent: boolean;
    tempComment: string;
    currentUser: string;
    currentmember: string;
    showPopup: boolean;
    deletingMeberObj;
    commentFlgEnabled = {};

    constructor( private scheduleConfigurationService: ScheduleConfigurationService, public committeeMemberNonEmployeeElasticService: CommitteeMemberNonEmployeeElasticService, private _ngZone: NgZone, public committeeMemberEmployeeElasticService: CommitteeMemberEmployeeElasticService, private scheduleAttendanceService: ScheduleAttendanceService, private activatedRoute: ActivatedRoute ) {
        this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
        this.currentUser = localStorage.getItem( 'currentUser' );
    }

    ngOnInit() {
        this.scheduleConfigurationService.currentScheduleData.subscribe( data => {
            this.result = data;
        } );
    }

    ngAfterViewInit() {
        this.searchText
            .valueChanges
            .map(( text: any ) => text ? text.trim() : '' )
            .do( searchString => searchString ? this.message = 'searching...' : this.message = '' )
            .debounceTime( 500 )
            .distinctUntilChanged()
            .switchMap( searchString => {
                return new Promise<Array<String>>(( resolve, reject ) => {
                    if ( this.nonEmployeeFlag == false ) {
                        this._ngZone.runOutsideAngular(() => {
                            this.committeeMemberEmployeeElasticService.search( searchString )
                                .then(( searchResult ) => {
                                    this.elasticSearchresults = [];
                                    this._ngZone.run(() => {
                                        this.hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );
                                        this.hits_highlight = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit.highlight );

                                        this.hits_source.forEach(( elmnt, j ) => {
                                            this.prncpl_id = this.hits_source[j].prncpl_id;
                                            this.full_name = this.hits_source[j].full_name;
                                            this.prncpl_nm = this.hits_source[j].prncpl_nm;
                                            this.email_addr = this.hits_source[j].email_addr;
                                            this.unit_number = this.hits_source[j].unit_number;
                                            this.unit_name = this.hits_source[j].unit_name;
                                            this.addr_line_1 = this.hits_source[j].addr_line_1;
                                            this.phone_nbr = this.hits_source[j].phone_nbr;
                                            this.elasticSearchresults.push( {
                                                label: this.full_name,
                                                id: this.prncpl_id
                                            }
                                            );
                                        }
                                        );
                                        if ( this.elasticSearchresults.length > 0 ) {
                                        } else {
                                            if ( this.searchTextModel && this.searchTextModel.trim() ) {
                                                this.message = '';
                                            }
                                        }
                                        resolve( this.elasticSearchresults );
                                    } );
                                } )
                                .catch(( error ) => {
                                    alert( "catch error" );
                                } );
                        } );
                    }
                    if ( this.nonEmployeeFlag == true ) {
                        this._ngZone.runOutsideAngular(() => {
                            this.committeeMemberNonEmployeeElasticService.search( searchString )
                                .then(( searchResult ) => {
                                    this._ngZone.run(() => {
                                        this.hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );
                                        this.hits_highlight = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit.highlight );
                                        this.hits_source.forEach(( elmnt, j ) => {
                                            this.rolodexId = this.hits_source[j].rolodex_id;
                                            this.first_name = this.hits_source[j].first_name;
                                            this.middle_name = this.hits_source[j].middle_name;
                                            this.last_name = this.hits_source[j].last_name;
                                            this.organization = this.hits_source[j].organization;
                                            this.elasticSearchresults.push( {
                                                label: this.first_name + '  ' + this.middle_name
                                                + '  ' + this.last_name,
                                                id: this.rolodexId
                                            }
                                            );
                                        }
                                        );
                                        if ( this.elasticSearchresults.length > 0 ) {
                                            this.message = '';
                                        } else {
                                            if ( this.searchTextModel && this.searchTextModel.trim() ) {
                                                this.message = 'nothing was found';
                                            }
                                        }
                                        resolve( this.elasticSearchresults );

                                    } );

                                } )
                                .catch(( error ) => {
                                    console.log( "catch error", error );

                                } );
                        } );
                    }
                } );
            } ).catch( this.handleError )
            .subscribe( this._results );
    }

    handleError(): any {
        this.message = 'something went wrong';
    }

    employeeRadioChecked() {
        this.nonEmployeeFlag = false;
        this.searchTextModel = '';
    }

    nonEmployeeRadioChecked() {
        this.nonEmployeeFlag = true;
        this.searchTextModel = '';
    }

    setInActiveAndchangeIconSearch() {
        this.searchActive = false;
        this.iconClass = 'fa fa-search';
    }

    setActiveAndchangeIconSearch() {
        this.searchActive = true;
        this.iconClass = 'fa fa-times';
    }

    clearsearchBox( e: any ) {
        e.preventDefault();
        this.searchTextModel = '';
    }

    addMember() {
        this.searchTextModel = '';
        this.guestMemberObj.alternateFlag = false;
        this.guestMemberObj.alternateFor = '';
        this.guestMemberObj.comments = null;
        this.guestMemberObj.guestFlag = true;
        this.guestMemberObj.guestMemberActive = true;
        this.guestMemberObj.memberPresent = false;
        this.guestMemberObj.nonEmployeeFlag = this.nonEmployeeFlag;
        this.guestMemberObj.personId = this.selectedMember.id;
        this.guestMemberObj.personName = this.selectedMember.label;
        this.guestMemberObj.roleName = '';
        this.guestMemberObj.updateTimestamp = new Date().getTime();
        this.guestMemberObj.updateUser = this.currentUser;
        this.scheduleAttendanceService.addGuestMember( this.guestMemberObj, this.scheduleId ).subscribe( data => {
            this.result = data;
        } );
    }
    selected( value ) {
        this.searchTextModel = value.label
        this.selectedMember = value;
    }

    addMemberDiv( event: any ) {
        event.preventDefault();
    }

    showComment( event: any, commentIndex: number ) {
        event.preventDefault();
        this.attendanceShowFlag = !this.attendanceShowFlag;
        this.showCommentFlag = !this.showCommentFlag;
        this.commentsIndex = commentIndex;
        if((!this.commentFlgEnabled[commentIndex]) == true){
            this.commentFlgEnabled[commentIndex] = true;
        }
    }

    editAttendanceData( event: any, index: number, memberObj ) {
        event.preventDefault();
        if((!this.editFlagEnabled[index]) == true){
            this.editFlagEnabled[index]= true;
        }
        this.tempAlternateFor = memberObj.alternateFor;
        this.tempComment = memberObj.comments;
        this.tempMemberPresent = memberObj.memberPresent;
    }

    saveAttendanceEditedData( event: any, index: number, memberObj ) {
        event.preventDefault();
        this.showCommentFlag = false;
        this.attendanceShowFlag = false;
        if((!this.editFlagEnabled[index]) == false){
            this.editFlagEnabled[index] = false;
        }
        if((!this.commentFlgEnabled[index]) == false){
            this.commentFlgEnabled[index] = false;
        }
        this.committeeId = this.result.committeeSchedule.committeeId;
        this.updatingMemberObj.alternateFor = memberObj.alternateFor;
        this.updatingMemberObj.committeeScheduleAttendanceId = memberObj.committeeScheduleAttendanceId;
        this.updatingMemberObj.memberPresent = memberObj.memberPresent;
        this.updatingMemberObj.comments = memberObj.comments;
        this.updatingMemberObj.updateUser = this.currentUser;
        this.updatingMemberObj.updateTimestamp = new Date().getTime();
        this.scheduleAttendanceService.updateMemberattendanceDate( this.committeeId, this.scheduleId, this.updatingMemberObj )
            .subscribe( data => {
                this.result = data;
            } );
    }

    cancelEditAttenfance( event: any, index: number, memberObj ) {
        event.preventDefault();
        this.editFlagEnabled[index] = !this.editFlagEnabled[index];
        memberObj.alternateFor = this.tempAlternateFor;
        memberObj.comments = this.tempComment;
        memberObj.memberPresent = this.tempMemberPresent;
    }
    
    hideComment( event: any, commentIndex: number ) {
        this.showCommentFlag = false;
        this.commentsIndex = commentIndex;
    }

    markAttendance( event: any, memberObj, index ) {
        event.preventDefault();
        if ( memberObj.memberPresent == true ) {
            memberObj.memberPresent = false;
        } else {
            memberObj.memberPresent = true;
        }
        this.tempAlternateFor = memberObj.alternateFor;
        this.tempComment = memberObj.comments;
        this.tempMemberPresent = memberObj.memberPresent;

        this.committeeId = this.result.committeeSchedule.committeeId;
        this.updatingMemberObj.alternateFor = memberObj.alternateFor;
        this.updatingMemberObj.committeeScheduleAttendanceId = memberObj.committeeScheduleAttendanceId;
        this.updatingMemberObj.memberPresent = memberObj.memberPresent;
        this.updatingMemberObj.comments = memberObj.comments;
        this.updatingMemberObj.updateUser = this.currentUser;
        this.updatingMemberObj.updateTimestamp = new Date().getTime();
        this.scheduleAttendanceService.updateMemberattendanceDate( this.committeeId, this.scheduleId, this.updatingMemberObj )
            .subscribe( data => {
                this.result = data;
            } );
    }

    showDeleteModal( event: any, memberObj ) {
        event.preventDefault();
        this.showPopup = true;
        this.deletingMeberObj = memberObj;
    }

    deleteAttendance( event: any ) {
        this.showPopup = false;
        this.committeeId = this.result.committeeSchedule.committeeId;
        this.scheduleAttendanceService.deleteScheduleMemberAttendance( this.committeeId, this.scheduleId, this.deletingMeberObj.committeeScheduleAttendanceId )
            .subscribe( data => {
                this.result = data;
            } );
    }

    changes( mebrObj ) {
    }
}
