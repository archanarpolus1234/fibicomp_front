import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ScheduleConfigurationService } from '../../../common/schedule-configuration.service';
import { ScheduleService } from '../../schedule.service';
import { ScheduleOtherActionsService } from './schedule-other-actions.service';

@Component( {
    selector: 'app-schedule-other-actions',
    templateUrl: './schedule-other-actions.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css', '../../../../assets/css/font-awesome.min.css', '../../../../assets/css/style.css', '../../../../assets/css/search.css']
} )
export class ScheduleOtherActionsComponent implements OnInit {
    result: any = {};
    committeeScheduleActItemsObject: any = {};
    otherActionsDescription: string = '';
    scheduleId: number;
    currentUser = localStorage.getItem( "currentUser" );

    constructor( public scheduleOtherActionsService: ScheduleOtherActionsService, public activatedRoute: ActivatedRoute, public scheduleService: ScheduleService, public scheduleConfigurationService: ScheduleConfigurationService ) { }

    ngOnInit() {
        this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
        this.scheduleConfigurationService.currentScheduleData.subscribe( data => {
            this.result = data;
        } );
    }

    OtherActionsTypeChange( type ) {
        var d = new Date();
        var time = d.getTime();
        for ( let actionType of this.result.scheduleActItemTypes ) {
            if ( actionType.description == type ) {
                this.committeeScheduleActItemsObject.scheduleActItemTypecode = actionType.scheduleActItemTypecode;
                this.committeeScheduleActItemsObject.scheduleActItemTypeDescription = actionType.description;
                this.committeeScheduleActItemsObject.updateUser = this.currentUser;
                this.committeeScheduleActItemsObject.updateTimestamp = time;
                this.result.committeeScheduleActItems = this.committeeScheduleActItemsObject;
            }
        }
    }

    addOtherActions() {
        if ( this.committeeScheduleActItemsObject.scheduleActItemTypeDescription == null ) {
            var d = new Date();
            var time = d.getTime();
            for ( let actionType of this.result.scheduleActItemTypes ) {
                if ( actionType.description == 'Adverse Event' ) {
                    this.committeeScheduleActItemsObject.scheduleActItemTypecode = actionType.scheduleActItemTypecode;
                    this.committeeScheduleActItemsObject.scheduleActItemTypeDescription = actionType.description;
                    this.committeeScheduleActItemsObject.updateUser = this.currentUser;
                    this.committeeScheduleActItemsObject.updateTimestamp = time;
                    this.result.committeeScheduleActItems = this.committeeScheduleActItemsObject;
                }
            }
        }
        if ( this.otherActionsDescription.trim().length != 0 && this.otherActionsDescription != '' && this.otherActionsDescription != null ) {
            this.committeeScheduleActItemsObject.itemDescription = this.otherActionsDescription;
            this.result.committeeScheduleActItems = this.committeeScheduleActItemsObject;
            this.scheduleOtherActionsService.addOtherActions( this.result.committee.committeeId, this.scheduleId, this.result.committeeScheduleActItems ).subscribe( data => {
                var temp: any = {};
                temp = data;
                this.result.committeeSchedule.committeeScheduleActItems = temp.committeeSchedule.committeeScheduleActItems;
            } );
        } else {
            alert( "Description is mandatory" );
        }
        this.committeeScheduleActItemsObject = {};
        this.otherActionsDescription = ' ';
    }

    deleteOtherActions( event: any, otherAction ) {
        event.preventDefault();
        this.scheduleOtherActionsService.deleteOtherActions( this.result.committee.committeeId, this.scheduleId, otherAction.commScheduleActItemsId ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.result.committeeSchedule.committeeScheduleActItems = temp.committeeSchedule.committeeScheduleActItems;
        });
    }
}
