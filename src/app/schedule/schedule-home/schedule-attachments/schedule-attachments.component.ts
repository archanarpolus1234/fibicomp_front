import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ScheduleService } from '../../schedule.service';
import { ScheduleConfigurationService } from '../../../common/schedule-configuration.service';
import { ActivatedRoute } from '@angular/router';
import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { ScheduleAttachmentsService } from './schedule-attachments.service';


@Component( {
    selector: 'app-schedule-attachments',
    templateUrl: './schedule-attachments.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css', '../../../../assets/css/font-awesome.min.css', '../../../../assets/css/style.css', '../../../../assets/css/search.css'],
    changeDetection: ChangeDetectionStrategy.Default
} )
export class ScheduleAttachmentsComponent implements OnInit {

    scheduleId;
    fil: FileList;
    result: any = {};
    showPopup = false;
    attachmentTypeDescription;
    newCommitteeScheduleAttachment: any = {};
    attachmentObject: any = {};
    showAddAttachment: boolean = false;
    public files: UploadFile[] = [];
    uploadedFile: any[] = [];
    attachmentList: any[] = [];
    tempSaveAttachment: any = {};
    currentUser = localStorage.getItem( "currentUser" );
    fileName: string;
    nullAttachmentData: boolean = false;
    
    constructor( public scheduleAttachmentsService: ScheduleAttachmentsService, public scheduleConfigurationService: ScheduleConfigurationService, public scheduleService: ScheduleService, public activatedRoute: ActivatedRoute ) { }

    ngOnInit() {
        this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
        this.scheduleConfigurationService.currentScheduleData.subscribe( data => {
            this.result = data;
            if(this.result !== null ){
                this.nullAttachmentData = true;
            }
        } );
    }

    onChange( files: FileList ) {
        this.fil = files;
        for ( var i = 0; i < this.fil.length; i++ ) {
            this.uploadedFile.push( this.fil[i] );
        }
    }

    attachmentTypeChange( type ) {
        var d = new Date();
        var timestamp = d.getTime();
        for ( let attachmentType of this.result.attachmentTypes ) {
            if ( attachmentType.description == type ) {
                this.attachmentObject.attachmentTypecode = attachmentType.attachmentTypecode;
                this.attachmentObject.description = attachmentType.description;
                this.attachmentObject.updateTimestamp = timestamp;
                this.attachmentObject.updateUser = this.currentUser;
            }
        }
    }

    public dropped( event: UploadEvent ) {
        this.files = event.files;
        for ( let file of this.files ) {
            this.attachmentList.push( file );
        }
        for ( const file of event.files ) {
            file.fileEntry.file( info => {
                this.uploadedFile.push( info );
            } );
        }
    }

    deleteFromUploadedFileList( item ) {
        for ( var i = 0; i < this.uploadedFile.length; i++ ) {
            if ( this.uploadedFile[i].name == item.name ) {
                this.uploadedFile.splice( i, 1 );
            }
        }
    }

    addAttachments() {
        if ( this.attachmentTypeDescription.trim().length == 0 && this.uploadedFile.length == 0 ) {
        } else {
            this.showAddAttachment = false;
            var d = new Date();
            var timestamp = d.getTime();
            this.newCommitteeScheduleAttachment.attachmentType = this.attachmentObject;
            this.newCommitteeScheduleAttachment.attachmentTypeCode = this.attachmentObject.attachmentTypecode;
            this.newCommitteeScheduleAttachment.description = this.attachmentTypeDescription;
            this.newCommitteeScheduleAttachment.updateTimestamp = timestamp;
            this.newCommitteeScheduleAttachment.updateUser = this.currentUser;
            this.result.newCommitteeScheduleAttachment = this.newCommitteeScheduleAttachment;
            this.scheduleAttachmentsService.addAttachments( this.result.committeeSchedule.scheduleId, this.result.newCommitteeScheduleAttachment, this.result.newCommitteeScheduleAttachment.attachmentTypeCode, this.uploadedFile, this.attachmentTypeDescription, this.currentUser ).subscribe( data => {
            
                this.uploadedFile = [];
                var temp = {};
                temp = data;
                this.result = temp;
            },
                error => {
                    console.log( "error", error )
                } );
        }
    }

    tempSave( event, attachment ) {
        this.showPopup = true;
        this.tempSaveAttachment = attachment;
    }
    
    deleteAttachments( event ) {
        event.preventDefault();
        this.showPopup = false;
        this.scheduleAttachmentsService.deleteAttachments( this.result.committeeSchedule.scheduleId, this.result.committee.committeeId, this.tempSaveAttachment.commScheduleAttachId ).subscribe( data => {
            var temp = {};
            temp = data;
            this.result = data;
        } );
    }
    
    downloadAttachements(event, attachment, attachments){ 
        event.preventDefault();
        let bytes = new Uint8Array(attachment.length);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = attachment.charCodeAt(i);
        }
        let blob = new Blob([bytes], { type: attachments.mimeType });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = attachments.fileName;
        a.click();
    }
}
