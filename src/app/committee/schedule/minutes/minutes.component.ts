import { Component, OnInit } from '@angular/core';

import {ScheduleConfigurationService} from '../schedule-configuration.service';
import { MinutesService } from "../minutes/minutes.service";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['../../../../assets/css/bootstrap.min.css', '../../../../assets/css/font-awesome.min.css', '../../../../assets/css/style.css', '../../../../assets/css/search.css']
})
export class MinutesComponent implements OnInit {

    result: any;
    isMinuteEntryPoppedUp: boolean = false;
    isContigencyPoppedUp: boolean = false;
    isEditMinuteItem = {};
    selectedOptionEntityType: string;
    currenEntryTab: string;
    selectedProtocol: string;
    selectedOtherBusItem: any = {};
    entityType = [];
    contingencyList = [];
    selectedProtocolContingencyCode: string;
    entryDescription: string;
    privateCommentFlag = false;
    finalFlag = false;
    isMandatoryFilled = true;
    minuteValidationMessage = "* Please fill the mandatory fields.";
    isToDelete = false;
    entryDescriptionOnEdit: string;
    attendances: Array<any> = [];
    minuteListItem: any = {};
    committeeId: string;
    scheduleId: number;
    public onDestroy$ = new Subject<void>();

    constructor( public scheduleConfigurationService: ScheduleConfigurationService, public minutesService: MinutesService ) {
        this.initialLoad();
    }

    ngOnInit() { }

    initialLoad() {
        this.scheduleConfigurationService.currentScheduleData.takeUntil(this.onDestroy$).subscribe( data => {
            this.result = data || [];
            if ( this.result != null ) {
                this.entityType = this.result.minuteEntrytypes;
                this.contingencyList = this.result.protocolContingencies;
            }
            this.selectedOptionEntityType = "1";
            this.setDefaultModalValues();
        } );
    }
    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
    setDefaultModalValues() {
        this.entryDescription = "";
        this.selectedProtocolContingencyCode = null;
        this.selectedProtocol = 'Select';
        this.selectedOtherBusItem = 'Select';
        this.privateCommentFlag = false;
        this.finalFlag = false;
        this.isMandatoryFilled = true;
    }
  
    showAddMinutes( $event ) {
        this.selectedOptionEntityType = "1";
        if ( this.isMinuteEntryPoppedUp == false ) {
            this.isMinuteEntryPoppedUp = true;
        }
        this.setDefaultModalValues();
    }

    onEntityTypeChange( newValue ) {
        this.selectedOptionEntityType = newValue;
        this.setDefaultModalValues();
    }

    onProtocolSelect( newValue ) {
        this.selectedProtocol = newValue;
    }

    onOtherItemSelect( newValue ) {
        this.selectedOtherBusItem = newValue;
        this.entryDescription = ( this.selectedOtherBusItem == 'Select' ) ? "" : this.selectedOtherBusItem.itemDescription;
        if ( this.selectedOtherBusItem == 'Select' ) {
            this.selectedOtherBusItem = {};
        }
    }

    searchContigency() {
        if ( this.isContigencyPoppedUp == false ) {
            this.isContigencyPoppedUp = true;
        }
    }

    selectContigencyItem( e, contigencyItem ) {
        this.selectedProtocolContingencyCode = contigencyItem.protocolContingencyCode;
        if ( this.isContigencyPoppedUp == true ) {
            this.isContigencyPoppedUp = false;
        }
        this.entryDescription = contigencyItem.description;
    }

    generateAttendance() {
        if ( this.entryDescription != "" ) {
            this.isMandatoryFilled = false;
            this.minuteValidationMessage = "* Attendance already generated.";
        } else {
            this.attendances = this.result.committeeSchedule.committeeScheduleAttendances;
            if ( this.attendances.length > 0 ) {
                this.attendances.forEach(( value, index ) => {
                    if ( value.memberPresent == true ) {
                        if ( value.guestFlag == true ) {
                            this.entryDescription = this.entryDescription + value.personName + " Guest" + "\n";
                        } else if ( value.alternateFlag == true ) {
                            this.entryDescription = this.entryDescription + value.personName + " Alternate for" + value.alternateFor + "\n";
                        } else {
                            this.entryDescription = this.entryDescription + value.personName + "\n";
                        }
                    }
                } );
            } else {
                this.entryDescription = "";
            }
        }
        if ( this.entryDescription == "" ) {
            this.isMandatoryFilled = false;
            this.minuteValidationMessage = "* No one present to generate attendace.";
        }
    }

    saveMinutes() {
        if ( this.result.newCommitteeScheduleMinute == null ) {
            this.result.newCommitteeScheduleMinute = {};
        }
        switch ( this.selectedOptionEntityType ) {
            case '1': this.isMandatoryFilled = this.entryDescription == "" ? false : true; break;
            case '2': this.isMandatoryFilled = this.entryDescription == "" ? false : true; break;
            case '3': this.contingencyList.forEach(( value, index ) => {
                if ( value.protocolContingencyCode == this.selectedProtocolContingencyCode ) {
                    this.result.newCommitteeScheduleMinute.protocolContingency = value;
                }
            } );
                this.isMandatoryFilled = ( this.selectedProtocol == 'Select' || this.selectedProtocol == null || this.entryDescription == "" ) ? false : true;
                break;
            case '4': this.isMandatoryFilled = ( ( this.selectedOtherBusItem == ( 'Select' || null ) ) || this.entryDescription == "" ) ? false : true;
                break;
            case '5': this.isMandatoryFilled = this.entryDescription == "" ? false : true; break;
            case '6': this.contingencyList.forEach(( value, index ) => {
                if ( value.protocolContingencyCode == this.selectedProtocolContingencyCode ) {
                    this.result.newCommitteeScheduleMinute.protocolContingency = value;
                }
            } );
                this.isMandatoryFilled = ( this.selectedProtocol == 'Select' || this.selectedProtocol == null || this.entryDescription == "" ) ? false : true;
                break;
        }

        this.entityType.forEach(( value, index ) => {
            if ( value.minuteEntryTypecode == this.selectedOptionEntityType ) {
                this.result.newCommitteeScheduleMinute.minuteEntrytype = value;
            }
        } );
        this.result.scheduleId = this.result.committeeSchedule.scheduleId;
        this.result.newCommitteeScheduleMinute.minuteEntryTypeCode = parseInt( this.selectedOptionEntityType );
        this.result.newCommitteeScheduleMinute.protocolContingencyCode = this.selectedProtocolContingencyCode;
        if ( this.selectedProtocol == 'Select' ) {
            this.selectedProtocol = null;
        }
        this.result.committeeId = this.result.committeeSchedule.committeeId;
        this.result.newCommitteeScheduleMinute.protocolNumber = this.selectedProtocol;
        this.result.newCommitteeScheduleMinute.commScheduleActItemsId = this.selectedOtherBusItem.commScheduleActItemsId;
        this.result.newCommitteeScheduleMinute.privateCommentFlag = this.privateCommentFlag;
        this.result.newCommitteeScheduleMinute.finalFlag = this.finalFlag;
        this.result.newCommitteeScheduleMinute.minuteEntry = this.entryDescription;
        this.result.newCommitteeScheduleMinute.createUser = localStorage.getItem( 'currentUser' );
        this.result.newCommitteeScheduleMinute.updateUser = localStorage.getItem( 'currentUser' );
        this.result.newCommitteeScheduleMinute.createTimestamp = new Date();
        this.result.newCommitteeScheduleMinute.updateTimestamp = new Date();
        if ( this.isMandatoryFilled == true ) {
            this.minutesService.saveMinuteData( this.result ).takeUntil(this.onDestroy$).subscribe( data => {
                this.result = data || [];
            } );
            this.initialLoad();
        }
    }

    saveAndNew() {
        this.saveMinutes();
    }

    saveAndClose() {
        this.saveMinutes();
        if ( this.isMinuteEntryPoppedUp == true && this.isMandatoryFilled == true ) {
            this.isMinuteEntryPoppedUp = false;
        }
    }

    editMinuteItem( e, i, minuteItem ) {
        e.preventDefault();
        this.isEditMinuteItem[i] = !this.isEditMinuteItem[i];
        this.entryDescriptionOnEdit = minuteItem.minuteEntry;
    }

    showDeleteModal( e, i, minuteItem, committeeId, scheduleId ) {
        e.preventDefault();
        this.isToDelete = true;
        this.minuteListItem = minuteItem;
        this.committeeId = committeeId;
        this.scheduleId = scheduleId;
    }

    deleteMinuteItem( e ) {
        e.preventDefault();
        var deleteRequestData: any = {};
        deleteRequestData.committeeId = this.committeeId;
        deleteRequestData.scheduleId = this.scheduleId;
        deleteRequestData.commScheduleMinuteId = this.minuteListItem.commScheduleMinutesId;
        if ( this.isToDelete == true ) {
            this.isToDelete = false;
        }
        this.minutesService.deleteMinuteData( deleteRequestData ).takeUntil(this.onDestroy$).subscribe( data => {
            this.result = data || [];
        } );
        this.initialLoad();
    }

    updateMinuteItem( e, i, minuteItem ) {
        e.preventDefault();
        this.isEditMinuteItem[i] = !this.isEditMinuteItem[i];
        if(minuteItem.minuteEntry != "") {
            this.result.newCommitteeScheduleMinute = minuteItem;
            this.result.committeeId = this.result.committeeSchedule.committeeId;
            this.result.scheduleId = this.result.committeeSchedule.scheduleId;
            this.result.newCommitteeScheduleMinute.updateTimestamp = new Date();
            this.result.newCommitteeScheduleMinute.updateUser = localStorage.getItem('currentUser');
            this.minutesService.updateMinuteData( this.result ).takeUntil(this.onDestroy$).subscribe( data => {
                this.result = data || [];
            } );
            this.initialLoad();
        }
    }

    cancelEditMinuteItem( e, i, minuteItem ) {
        e.preventDefault();
        this.isEditMinuteItem[i] = !this.isEditMinuteItem[i];
        minuteItem.minuteEntry = this.entryDescriptionOnEdit;
    }
}
