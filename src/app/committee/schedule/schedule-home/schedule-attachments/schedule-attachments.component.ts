import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ScheduleService } from '../../schedule.service';
import { ScheduleConfigurationService } from '../../schedule-configuration.service';
import { ActivatedRoute } from '@angular/router';
import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { ScheduleAttachmentsService } from './schedule-attachments.service';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';

@Component( {
    selector: 'app-schedule-attachments',
    templateUrl: './schedule-attachments.component.html',
    styleUrls: ['../../../../../assets/css/bootstrap.min.css', '../../../../../assets/css/font-awesome.min.css', '../../../../../assets/css/style.css', '../../../../../assets/css/search.css'],
    changeDetection: ChangeDetectionStrategy.Default
} )
export class ScheduleAttachmentsComponent implements OnInit {
    scheduleId;
    fil: FileList;
    result: any = {};
    public onDestroy$ = new Subject<void>();
    showPopup = false;
    attachmentTypeDescription;
    newCommitteeScheduleAttachment: any = {};
    attachmentObject: any = {};
    showAddAttachment: boolean = false;
    public files: UploadFile[] = [];
    uploadedFile: any[] = [];
    attachmentList: any[] = [];
    tempSaveAttachment: any = {};
    currentUser: string;
    fileName: string;
    nullAttachmentData: boolean = false;
    attachmentEditIndex: number;
    editScheduleattachment: any={};
    tempEditObject : any ={};
    ismandatoryFilled: boolean = true;
    attachmentWarningMsg: string;
    attachment: any = {};

    constructor( public scheduleAttachmentsService: ScheduleAttachmentsService, public scheduleConfigurationService: ScheduleConfigurationService, public scheduleService: ScheduleService, public activatedRoute: ActivatedRoute ) {
        this.currentUser = localStorage.getItem( "currentUser" );
    }

    ngOnInit() {
        this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
        this.scheduleConfigurationService.currentScheduleData.takeUntil(this.onDestroy$).subscribe( data => {
            this.result = data;
            if ( this.result !== null ) {
                this.nullAttachmentData = true;
            }
        } );
    }
    
    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    //when file list changes
    onChange( files: FileList ) {
        this.fil = files;
        this.ismandatoryFilled = true;
        for ( var i = 0; i < this.fil.length; i++ ) {
            this.uploadedFile.push( this.fil[i] );
        }
    }

    //change type option
    attachmentTypeChange( type ) {
        var d = new Date();
        var timestamp = d.getTime();
        for ( let attachmentType of this.result.attachmentTypes ) {
            if ( attachmentType.description == type ) {
                this.attachmentObject.attachmentTypecode = attachmentType.attachmentTypecode;
                this.attachmentObject.description = attachmentType.description;
                this.attachment.description = attachmentType.description;
                this.attachmentObject.updateTimestamp = timestamp;
                this.attachmentObject.updateUser = this.currentUser;
            }
        }
    }

    //files are dropped in drag and drop space
    public dropped( event: UploadEvent ) {
        this.files = event.files;
        this.ismandatoryFilled = true;
        for ( let file of this.files ) {
            this.attachmentList.push( file );
        }
        for ( const file of event.files ) {
            file.fileEntry.file( info => {
                this.uploadedFile.push( info );
            } );
        }
    }

    //delete file function
    deleteFromUploadedFileList( item ) {
        for ( var i = 0; i < this.uploadedFile.length; i++ ) {
            if ( this.uploadedFile[i].name == item.name ) {
                this.uploadedFile.splice( i, 1 );
            }
        }
    }

    showAddAttachmentPopUp( e ) {
        e.preventDefault();
        this.showAddAttachment = true;
        this.ismandatoryFilled = true;
        this.uploadedFile = [];
        this.attachmentTypeDescription = '';
        this.attachment.description = 'Select';
    }

    addAttachments() {
        if ( this.attachment.description == 'Select' ) {
            this.ismandatoryFilled = false;
            this.attachmentWarningMsg = '* Please select an attachment type';
        } else if (this.uploadedFile.length == 0 ) {
            this.ismandatoryFilled = false;
            this.attachmentWarningMsg = '* Please choose at least one file to attach';
        } else {
            this.ismandatoryFilled = true;
            this.showAddAttachment = false;
            var d = new Date();
            var timestamp = d.getTime();
            this.newCommitteeScheduleAttachment.attachmentType = this.attachmentObject;
            this.newCommitteeScheduleAttachment.attachmentTypeCode = this.attachmentObject.attachmentTypecode;
            this.newCommitteeScheduleAttachment.description = this.attachmentTypeDescription;
            this.newCommitteeScheduleAttachment.updateTimestamp = timestamp;
            this.newCommitteeScheduleAttachment.updateUser = this.currentUser;
            this.result.newCommitteeScheduleAttachment = this.newCommitteeScheduleAttachment;
            this.scheduleAttachmentsService.addAttachments( this.result.committeeSchedule.scheduleId, this.result.newCommitteeScheduleAttachment, this.result.newCommitteeScheduleAttachment.attachmentTypeCode, this.uploadedFile, this.attachmentTypeDescription, this.currentUser ).takeUntil(this.onDestroy$).subscribe( data => {
                this.uploadedFile = [];
                var temp:any = {};
                temp = data;
                this.result.committeeSchedule = temp.committeeSchedule;
            },
                error => {
                    console.log( "error", error )
                } );
        }
    }

    //temporarily save while showing modal pop up
    tempSave( event, attachment ) {
        this.showPopup = true;
        this.tempSaveAttachment = attachment;
    }

    deleteAttachments( event ) {
        event.preventDefault();
        this.showPopup = false;
        this.scheduleAttachmentsService.deleteAttachments( this.result.committeeSchedule.scheduleId, this.result.committee.committeeId, this.tempSaveAttachment.commScheduleAttachId ).takeUntil(this.onDestroy$).subscribe( data => {
        var temp:any = {};
        temp = data;
        this.result.committeeSchedule = temp.committeeSchedule;
        } );
    }

    downloadAttachements( event,attachments ) {
        event.preventDefault();
        this.scheduleAttachmentsService.downloadAttachment( attachments.commScheduleAttachId, attachments.mimeType ).takeUntil(this.onDestroy$).subscribe(
            data => {
                var a = document.createElement( "a" );
                a.href = URL.createObjectURL( data );
                a.download = attachments.fileName;
                a.click();
            } );
        return false;
    }
    
    editAttachments(event: any, index, attachments){
        event.preventDefault();
        this.tempEditObject.description = attachments.description;
        this.editScheduleattachment[index] = !this.editScheduleattachment[index];
    }
    
    saveEditedattachments(event: any,index, attachments){
        event.preventDefault();
        this.editScheduleattachment[index] = !this.editScheduleattachment[index];
        this.attachmentObject = {};
        this.attachmentObject.description = attachments.description;
        this.attachmentObject.updateTimestamp = new Date().getTime();
        this.attachmentObject.updateUser = this.currentUser;
        this.attachmentObject.commScheduleAttachId = attachments.commScheduleAttachId;
        this.scheduleAttachmentsService.updateScheduleAttachments(this.result.committee.committeeId, this.result.committeeSchedule.scheduleId, this.attachmentObject)
        .takeUntil(this.onDestroy$).subscribe(data=>{
            this.result = data;
        });
    }
    
    cancelEditedattachments(event:any,index, attachments){
        event.preventDefault();
        this.editScheduleattachment[index] = !this.editScheduleattachment[index];
        attachments.description = this.tempEditObject.description;
    }

    closeAttachments(){
        this.showAddAttachment=false;
        this.uploadedFile = [];
    }
   
}
