import { Component, OnDestroy  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import {ISubscription} from 'rxjs/Subscription';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

import { GrantService } from "./grant.service";
import { SessionManagementService } from "../session/session-management.service";

@Component( {
    selector: 'grant',
    templateUrl: 'grant.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css'],
    providers:[SessionManagementService]
} )

export class GrantComponent {
    mode: string = "view"
    editClass: string = "committeeBox";
    addResearch: boolean = false;
    showAddAttachment: boolean = false;
    isEligibleAddopen: boolean = false;
    showAddPointOfContact: boolean = false;
    editScheduleattachment: boolean = true;
    subscriptiption: ISubscription;
    result: any ={}
    uploadedFile: any[] = [];
    file: FileList;
    ismandatoryFilled: boolean = true;
    attachmentObject: any = {};
    public files: UploadFile[] = [];
    attachmentList: any[] = [];

    constructor( public route : ActivatedRoute, private grantService: GrantService, private router: Router, private sessionService: SessionManagementService) {
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        }
    }

    ngOnInit() {
       this.mode = this.route.snapshot.queryParamMap.get('mode');
        if(this.mode == 'view') {
            this.editClass="committeeBoxNotEditable";
        } else if(this.mode == 'create' || this.mode == 'edit') {
            this.editClass="committeeBox";
        }
        this.loadGrantInitData();
    }
    
    ngOnDestroy(){
        this.subscriptiption.unsubscribe();
    }
    
    loadGrantInitData(){
       this.subscriptiption= this.grantService.createGrantCall().subscribe(data=>{
            this.result = data;
        });
    }
    
    showaddPointOfContact() {
        this.showAddPointOfContact = !this.showAddPointOfContact;
    }
    
    addPointOfContact(pointOfContact) {
        
    }
    
    deletePointOfContactConfirmation($event,pointOfContact) {
        
    }
        
    showaddAreaOfResearch() {
        this.addResearch = !this.addResearch;
    }

    addAreaOfResearch(data) {

    }
    
    deleteAreaOfResearchConfirmation($event,area) {

    }
    
    showaddEligibility() {
        this.isEligibleAddopen = !this.isEligibleAddopen;
    }
    
    addEligibility(areaInput) {
        
    }
    
    deleteEligibilityConfirmation($event,area) {
        
    }
    
    showAddAttachmentPopUp(e) {
        e.preventDefault();
        this.showAddAttachment = true;
    }
    
    editAttachments($event,i, attachments) {
        $event.preventDefault();
        this.editScheduleattachment = !this.editScheduleattachment;
    }
    
    saveEditedattachments($event,i, attachments) {
        $event.preventDefault();
        this.editScheduleattachment = !this.editScheduleattachment;
    }
    
    cancelEditedattachments($event,i, attachments) {
        $event.preventDefault();
        this.editScheduleattachment = !this.editScheduleattachment;        
    }
    
    downloadAttachements(e, attachments) {
        e.preventDefault();
    }
    
    tempSave(e,attachments) {
        
    }
    
    closeAttachments(){
        this.showAddAttachment=false;
        this.uploadedFile = [];
    }
    
    attachmentTypeChange( type ) {
        var d = new Date();
        var timestamp = d.getTime();
        for ( let attachmentType of this.result.grantCallAttachTypes ) {
            if ( attachmentType.description == type ) {
                this.attachmentObject.attachmentTypecode = attachmentType.grantAttachmentTypeCode;
                this.attachmentObject.description = attachmentType.description;
                this.attachmentObject.updateTimestamp = timestamp;
                this.attachmentObject.updateUser = localStorage.getItem('currentUser');
            }
        }
    }
    
    addAttachments(){
    }
    
  //when file list changes
    onChange( files: FileList ) {
        this.file = files;
        this.ismandatoryFilled = true;
        for ( var i = 0; i < this.file.length; i++ ) {
            this.uploadedFile.push( this.file[i] );
        }
    }
    
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
}
