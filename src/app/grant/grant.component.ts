import { Component, OnDestroy,ChangeDetectionStrategy,ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'
import {Subscription} from 'rxjs/Subscription';
import { CompleterService, CompleterData } from 'ng2-completer';
import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { Subject } from 'rxjs';
import { Console } from '@angular/core/src/console';

import { GrantService } from "./grant.service";
import { SessionManagementService } from '../session/session-management.service';


@Component( {
    selector: 'grant',
    templateUrl: 'grant.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css'],
    changeDetection: ChangeDetectionStrategy.Default
} )

export class GrantComponent {
    mode: string = "create";
    grantId: string ="";
    editClass: string = "committeeBox";
    addResearch: boolean = false;
    showAddAttachment: boolean = false;
    isEligibleAddopen: boolean = false;
    showAddPointOfContact: boolean = false;
    editScheduleattachment: boolean = true;
    subscription: Subscription;
    result: any ={};
    status : string = "hello";
    keywordsList :  any  = {};
    keywordDisplayList : any[] = [];
    selectedKeyword : string;
    keywordObject : any = {};
    grantCallTypeSelected : string ="Select";
    selectedSponsor: string;
    currentUser : string = localStorage.getItem('currentUser');

    uploadedFile: any[] = [];
    file: FileList;
    ismandatoryFilled: boolean = true;
    attachmentObject: any = {};
    public files: UploadFile[] = [];
    pointOfContactObject :any = {};
    pointOfContactList :any[] = [];
    validationError: string = " ";
    valid : boolean = true;
    sponsorList : any[] = [];
    areaList : any = {};
    selectedResearchArea: string;
    researchAreaList : any[] = [];
    saveType:string="SAVE";
    selectedCriteria: string = "Select";
    selectedEligibilityType: string = "Select";
    eligibilityList:any[] = [];
    attachmentDescription: string;
    public onDestroy$ = new Subject<void>();
    temp2: any ={};
    tempSaveAttachment:any ={};
    tempSavePOC:any = {};
    tempSaveResearchArea:any = {};
    tempSaveEligibility:any = {};
    index: number;
    showDeleteAttachment:boolean = false;
    showDeleteEligibility:boolean = false;
    selectedFundingType: string = "Select";
    
    selectedActivityType: string = "Select";
    showDeleteResearchArea:boolean =false;
    selectedSponsorType: string;
    tempSavePointOfContactObject:any = {}; 
    showDeletePOC:boolean = false;
    showWarning:boolean = false;
    scrollToTop:string = "";
    showPublishWarning:boolean = false;
    currentDate:Date = new Date();
    saveSuccessfulMessage: string = null;
    keywordFlag:boolean= false;
    
    

    constructor( public changeRef :ChangeDetectorRef,public completerService : CompleterService, public router : Router,public route : ActivatedRoute, private grantService: GrantService, private sessionService: SessionManagementService) {
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        }
    }

    ngOnInit() {
        this.currentDate.setDate(this.currentDate.getDate()-1);
       this.grantId = this.route.snapshot.queryParamMap.get('grantId');
        if(this.grantId==null) {
            this.mode='create';
            this.editClass="committeeBox";
            this.loadGrantInitData();
        } else {
            this.grantService.loadGrantById(this.grantId).takeUntil(this.onDestroy$).subscribe(response=>{
                        this.result = response;

                        if(this.result.grantCall.grantCallStatus.description == 'Draft') {
                            this.mode = 'edit';
                            this.editClass="committeeBox";
                            if(this.result.grantCall.sponsorCode!=null) {
                                this.grantService.fetchSponsorsBySponsorType(this.result.grantCall.sponsorType.code).takeUntil(this.onDestroy$).subscribe(success=>{
                                    var temp :any= {};
                                    temp = success;
                                        this.sponsorList = temp.sponsors;
                                    this.selectedSponsorType = this.result.grantCall.sponsorType.description;
                                    this.selectedSponsor = this.result.grantCall.sponsor.sponsorName;
                                    this.selectedActivityType = this.result.grantCall.activityType.description;
                                    this.selectedFundingType = this.result.grantCall.fundingSourceType.description; 
                                });
                            
                            } else {
                                this.grantService.fetchSponsorsBySponsorType(this.result.sponsorTypes[0].code).takeUntil(this.onDestroy$).subscribe(success=>{
                                    var temp :any= {};
                                    temp = success; 
                                    this.sponsorList = temp.sponsors;
                                    this.selectedSponsorType = this.result.sponsorTypes[0].description;
                                   this.selectedSponsor = temp.sponsors[0].sponsorName;
                                    this.selectedActivityType = this.result.activityTypes[0].description;
                                    this.selectedFundingType =  this.result.fundingSourceTypes[0].description;
                                    
                                   
                                    
                                    
                                    
                                    this.sponsorTypeChange( this.selectedSponsorType);
                                    this.sponsorNameChange( this.selectedSponsor);
                                    this.researchTypeChange(this.selectedActivityType)
                                    this.fundingTypeChange(this.selectedFundingType);

                                });
                            }
                           this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' )
                           this.areaList = this.completerService.local( this.result.researchAreas, 'description', 'description' )
                        } else {
                            this.mode='view';
                            this.editClass="committeeBoxNotEditable";
                        }
                        
                        //placing list from loaded grantCall 
                        this.keywordDisplayList = this.result.grantCall.grantCallKeywords;
                        this.eligibilityList =  this.result.grantCall.grantCallEligibilities;
                        this.grantCallTypeSelected = this.result.grantCall.grantCallType.description;
                    },error=>{
                    }); 
        }
     
    }
    
    ngOnDestroy(){
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
    
    loadGrantInitData(){ 
        this.grantService.createGrantCall().takeUntil(this.onDestroy$).subscribe(data=>{
            this.result = data;
            this.grantService.fetchSponsorsBySponsorType(this.result.sponsorTypes[0].code).takeUntil(this.onDestroy$).subscribe(success=>{
                var temp :any= {};
                temp = success;
                this.sponsorList = temp.sponsors;
                this.selectedSponsorType = this.result.sponsorTypes[0].description;
                this.selectedSponsor = temp.grantCall.sponsor.sponsorName;
            });
           this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' )
           this.areaList = this.completerService.local( this.result.researchAreas, 'description', 'description' )
            
        });
    }
    showaddPointOfContact() {
        this.showAddPointOfContact = !this.showAddPointOfContact;
    }
    
    addPointOfContact(pointOfContactObject) {
        if(this.validateEmailAndMobile(this.pointOfContactObject.email.trim(),this.pointOfContactObject.mobile) && this.pointOfContactObject.fullName.trim().length>0 && this.pointOfContactObject.designation.trim().length>0 ) {
            this.pointOfContactObject.personId = "";
            this.result.grantCall.grantCallContacts.push(pointOfContactObject);
            this.pointOfContactObject = {};
            this.valid = true;
            this.changeRef.detectChanges();
        } else {
            this.validationError = "Fields are incorrect or not filled";
            this.valid = false;
        }
       
    }
    validateEmailAndMobile(mail,mobile) {
		if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail) && String(mobile).length >= 10)
		{
		  return (true)
		}
		return (false)
    }
    
    tempSavePointOfContact($event,pointOfContact,k) {
        $event.preventDefault();
        this.tempSavePointOfContactObject = pointOfContact;
        this.index = k ;
        this.showDeletePOC = true;

    }
     
    deletePointOfContact($event) {
        this.showDeletePOC = false;
        for(let index=0;index<this.result.grantCall.grantCallContacts.length;index++) {
            if( this.tempSavePointOfContactObject.grantContactId == null) {
               if(index == this.index) {
                this.result.grantCall.grantCallContacts.splice(this.index,1);
                this.changeRef.detectChanges();
               }
              
            } else {
                 if(this.result.grantCall.grantCallContacts[index].grantContactId ==  this.tempSavePointOfContactObject.grantContactId) {
                    this.grantService.deleteGrantCallContact(this.result.grantCall.grantCallId, this.tempSavePointOfContactObject.grantContactId).subscribe(deleted=>{
                        var temp:any ={};
                        temp = deleted;
                        this.result.grantCall.grantCallContacts.splice(this.index,1);
                        this.changeRef.detectChanges();
                    });
                 }

            }
        }
    }
        
    showaddAreaOfResearch() {
        this.addResearch = !this.addResearch;
    }

    
    showaddEligibility() {
        this.isEligibleAddopen = !this.isEligibleAddopen;
    }
    
    addEligibility() {
        var tempObj:any = {};
        var d = new Date();
        var timestamp = d.getTime();
        if(this.selectedCriteria == null || this.selectedEligibilityType == null) {
            
        } else {
            for(let criteria of this.result.grantCallCriterias) {
                if(this.selectedCriteria == criteria.description) {
                    tempObj.grantCriteriaCode = criteria.grantCriteriaCode;
                    tempObj.grantCallCriteria= criteria
                    for(let type of this.result.grantCallEligibilityTypes) {
                        if(this.selectedEligibilityType == type.description) {
                            tempObj.grantEligibilityTypeCode = type.grantEligibilityTypeCode;
                            tempObj.grantCallEligibilityType = type;
                            tempObj.updateTimestamp = timestamp;
                            tempObj.updateUser = this.currentUser;
                            this.result.grantCall.grantCallEligibilities.push(tempObj);

                        }
                    }

                }
            }
        }
       
    }

    tempSaveEligibilityObject($event,eligibility,k) {
        this.showDeleteEligibility = true;
        this.tempSaveEligibility = eligibility;
        this.index = k;
    }
    
    deleteEligibility($event) {
            this.showDeleteEligibility = false;
        for(let i=0;i<this.result.grantCall.grantCallEligibilities.length;i++) {
            if( this.tempSaveEligibility.grantEligibilityId == null ) {
                if(i == this.index) {
                    this.result.grantCall.grantCallEligibilities.splice(this.index,1);
                    break;
                }
                
               
            } else {
                if( this.result.grantCall.grantCallEligibilities[i].grantEligibilityId == this.tempSaveEligibility.grantEligibilityId ) {
                   // service goes here
                   this.grantService.deleteGrantCallEligibility( this.result.grantCall.grantCallId,this.tempSaveEligibility.grantEligibilityId ).subscribe(deleted=>{
                        var temp:any ={};
                        temp = deleted;
                        this.result.grantCall.grantCallEligibilities.splice(this.index,1);
                   });
                }
            }

        }
    }
    
    showAddAttachmentPopUp(e) {
        e.preventDefault();
        this.showAddAttachment = true;
        this.uploadedFile = [];
        this.attachmentDescription = '';
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
  
    deleteAttachments(e) {
        e.preventDefault();
        this.showDeleteAttachment = false;
        if(this.tempSaveAttachment.attachmentId == null) {
            this.result.grantCall.grantCallAttachments.splice(this.index,1);
        } else {

            this.grantService.deleteGrantCallAttachment(this.result.grantCall.grantCallId,this.tempSaveAttachment.attachmentId).subscribe(success=>{
                var temp:any = {};
                temp = success;
                this.result.grantCall.grantCallAttachments.splice(this.index,1);
                this.changeRef.detectChanges();
                });
        }
        
    }

    downloadAttachments( event,attachment ) {
        event.preventDefault();
        if(attachment.attachmentId != null) {
            this.grantService.downloadAttachment( attachment.attachmentId ).takeUntil(this.onDestroy$).subscribe(
                data => {
                    var a = document.createElement( "a" );
                    a.href = URL.createObjectURL( data );
                    a.download = attachment.fileName;
                    a.click();
                } );
        } else { 
           var url = "data:"+attachment.mimeType+";base64,"+attachment.attachment;
            var a = document.createElement( "a" );
           a.href = url;
            a.download = attachment.fileName;
            a.click(); 
        }
        
    }

    tempSaveAttachments(e,attachments,i) {

        this.tempSaveAttachment = attachments;
        this.index = i;
        this.showDeleteAttachment = true;
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
                this.attachmentObject = attachmentType;
            }
        }
    }
    
    addAttachments(){
        var d = new Date();
        
        var timestamp = d.getTime();
        var tempObjectForAdd:any = {};
        tempObjectForAdd.grantCallAttachType = this.attachmentObject;
        tempObjectForAdd.grantAttachmentTypeCode = this.attachmentObject.grantAttachmentTypeCode;
        tempObjectForAdd.description = this.attachmentDescription;
        tempObjectForAdd.updateTimestamp = timestamp;
        tempObjectForAdd.updateUser = this.currentUser;
        this.result.newAttachment = tempObjectForAdd;
        this.grantService.addGrantCallAttachment(this.result.grantCall,this.result.newAttachment,this.uploadedFile).subscribe(success=>{
            var temporaryObject:any ={};
            temporaryObject = success;
            this.result.grantCall = temporaryObject.grantCall;
        },error=>{},()=>{
            this.closeAttachments();
        });
        this.temp2 = this.result;
        
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
        for ( const file of event.files ) {
            file.fileEntry.file( info => {
                this.uploadedFile.push( info );
                this.changeRef.detectChanges();
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

    grantCallTypeChange(type) {
       for(let grantCallType of this.result.grantCallTypes) {
           if(grantCallType.description == type) {
               this.result.grantCall.grantCallType = grantCallType;
               this.result.grantCall.grantTypeCode = grantCallType.grantTypeCode;
           }
       }
    }
    grantCallStatusChange(status) {
        for(let grantCallStatus of this.result.grantCallStatus) {
            if(grantCallStatus.description == status) {
                this.result.grantCall.grantCallStatus = grantCallStatus;
                this.result.grantCall.grantStatusCode = grantCallStatus.grantStatusCode;
            }
        }
    }
    sponsorTypeChange(type) {
        for(let sponsorType of this.result.sponsorTypes) {
            if(sponsorType.description == type) {
                this.grantService.fetchSponsorsBySponsorType(sponsorType.code).takeUntil(this.onDestroy$).subscribe(success=>{
                    var temp :any= {};
                    temp = success;
                    this.sponsorList = temp.sponsors;
                    this.result.grantCall.sponsor = this.sponsorList[0];
                    this.result.grantCall.sponsorCode = this.sponsorList[0].code;
                });
                this.result.grantCall.sponsorType = sponsorType;
                this.result.grantCall.sponsorTypeCode = sponsorType.code;
            }
        }
    }
    researchTypeChange(type) {
        for(let activityType of this.result.activityTypes) {
            if(activityType.description == type) {
                var tempObj:any={};
                tempObj.code =  activityType.code;
                tempObj.description =  activityType.description;
                this.result.grantCall.activityType = tempObj;
                this.result.grantCall.activityTypeCode = activityType.code;
            }
        }
    }

     fundingTypeChange(type) {
        for(let fundingType of this.result.fundingSourceTypes) {
            if(fundingType.description == type) {
                var tempObj:any={};
                tempObj.fundingSourceTypeCode = fundingType.fundingSourceTypeCode;
                tempObj.description = fundingType.description;
                this.result.grantCall.fundingSourceType = tempObj;
                this.result.grantCall.fundingSourceTypeCode = fundingType.fundingSourceTypeCode;
            }
        }
    }

    sponsorNameChange(sponsorName:string ) {
        for(let sponsor of this.sponsorList) {
            if(sponsor.sponsorName == sponsorName) {
                sponsor.sponsorType = this.result.grantCall.sponsorType;
                sponsor.sponsorTypeCode = this.result.grantCall.sponsorType.code;
                this.result.grantCall.sponsor = sponsor;
                this.result.grantCall.sponsorCode = sponsor.sponsorCode;
            }
        }
    }

    keywordChangeFunction() {
        var d = new Date();
        var timeStamp = d.getTime();
        this.keywordObject = {};
         this.keywordFlag=false;
     
        for(let keyword of this.result.scienceKeywords) {
            if(keyword.description == this.selectedKeyword) {
               this.keywordObject.scienceKeywordCode = keyword.code;
               this.keywordObject.scienceKeyword = keyword;
               this.keywordObject.updateTimestamp = timeStamp;
               this.keywordObject.updateUser = this.currentUser;
               this.result.grantCall.grantCallKeywords.push(this.keywordObject);
            }
        }
        if(this.result.grantCall.grantCallKeywords.length!=0) {
        for(let word of this.result.grantCall.grantCallKeywords) {
            if(word.scienceKeyword.description == this.selectedKeyword) {
            this.keywordFlag = true;
            } 
        }
        if(this.keywordFlag==true) {
        } else {
            this.result.grantCall.grantCallKeywords.push(this.keywordObject);
        }
    } else {
        
        this.result.grantCall.grantCallKeywords.push(this.keywordObject);
    
    } 



        this.selectedKeyword = null;
    }

    deleteKeyword(keyword,k) {
        for(let i=0;i<this.result.grantCall.grantCallKeywords.length;i++) {
           
                if(this.result.grantCall.grantCallKeywords[i].grantKeywordId!=null) {
                    if(this.result.grantCall.grantCallKeywords[i].grantKeywordId == keyword.grantKeywordId) {
                        this.grantService.deleteGrantCallKeyword(this.result.grantCall.grantCallId,keyword.grantKeywordId).subscribe(success=>{
                            var temp :any = {};
                            temp = success;
                        this.result.grantCall.grantCallKeywords.splice(i,1);
                        });
                    }
                   
                } else {
                        if(i==k) {
                            this.result.grantCall.grantCallKeywords.splice(k,1);
                            break;
                        }
                }
                
            
        }
    }

    saveGrant() {
        
        if(this.result.grantCall.grantCallType==null || this.result.grantCall.grantCallStatus == null || this.result.grantCall.grantCallName.trim() == null || this.result.grantCall.openingDate == null || this.result.grantCall.closingDate == null || this.result.grantCall.description.trim() == null || this.result.grantCall.maximumBudget == null ) {
            var scrollTop;
            this.showWarning = true;
            this.saveSuccessfulMessage = "";
            //Scroll to Top Javascript Function
             scrollTop = setInterval(function(){ 
                        if(document.body.scrollTop == document.documentElement.scrollTop) {
                            clearInterval(scrollTop);
                        }
                        document.body.scrollTop = document.documentElement.scrollTop -=10 ; }, 1000/30);
        } else {
            this.scrollToTop = "";
            this.showWarning = false;
            var d = new Date();
            var timeStamp = d.getTime();
            this.result.grantCall.createUser = this.currentUser;
            this.result.grantCall.createTimestamp = timeStamp;
            this.result.grantCall.updateTimeStamp = timeStamp;
            this.result.grantCall.updateUser = this.currentUser;
            if(this.result.grantCall.grantCallStatus.description=='Draft' && this.mode=='create' && this.result.grantCall.grantCallId ==null) {
                this.saveType="SAVE";
            } else {
                this.saveType = "UPDATE";
            }
            this.grantService.saveGrantCall(this.result.grantCall,this.result.newAttachments,this.saveType,this.uploadedFile).takeUntil(this.onDestroy$).subscribe(response=>{
                var temp:any = {};
                temp = response;
                this.result.grantCall = temp.grantCall;
                this.grantId = this.result.grantCall.grantCallId;
               

                
                },error=>{
                    this.saveSuccessfulMessage = null;
            },()=>{ this.saveSuccessfulMessage = null;});
        }
       
    }

    addResearchArea() {
        var d =new Date();
        var timeStamp = d.getTime();
        for(let researchArea of this.result.researchAreas) {
            if(researchArea.description == this.selectedResearchArea) {
                var tempObj:any = {};
                tempObj.researchAreaCode = researchArea.researchAreaCode;
                tempObj.researchArea  = researchArea;
                tempObj.updateTimestamp = timeStamp;
                tempObj.updateUser = this.currentUser;
                this.result.grantCall.grantCallResearchAreas.push(tempObj);
                 
            }
        }
    }

    tempSaveResearchAreaObject(e,researchArea) {
        e.preventDefault();
        this.tempSaveResearchArea = researchArea;
        this.showDeleteResearchArea = true;
    }

    deleteResearchArea($event) {
        this.showDeleteResearchArea = false;
        for( let i = 0;i<this.result.grantCall.grantCallResearchAreas.length;i++ ) {
            if(this.result.grantCall.grantCallResearchAreas[i].researchArea.description == this.tempSaveResearchArea.researchArea.description) {
                
                if(this.result.grantCall.grantCallId!=null && this.result.grantCall.grantCallResearchAreas[i].grantResearchAreaId!=null) {
                    this.grantService.deleteGrantCallAreaOfResearch(this.result.grantCall.grantCallId,this.tempSaveResearchArea.grantResearchAreaId).subscribe(deleted=>{
                         
                        this.result.grantCall.grantCallResearchAreas.splice(i,1);
                    })
                } else {
                    this.result.grantCall.grantCallResearchAreas.splice(i,1);
                }
                
            }
        }
    }

    publishCall() {
       
                    
        if(this.result.grantCall.grantCallId ==null || this.result.grantCall.grantCallType==null || this.result.grantCall.grantCallStatus == null || this.result.grantCall.grantCallName.trim() == null || this.result.grantCall.openingDate == null || this.result.grantCall.closingDate == null || this.result.grantCall.description.trim() == null || this.result.grantCall.maximumBudget == null ) {
            var scrollTop;
            //Scroll to Top Javascript Function
            this.showWarning = true;
             scrollTop = setInterval(function(){ 
                        if(document.body.scrollTop == document.documentElement.scrollTop) {
                            clearInterval(scrollTop);
                        }
                       
                        document.body.scrollTop = document.documentElement.scrollTop -=10 ; }, 1000/30);

        } else {
            this.scrollToTop = "";
            this.showWarning = false;
            this.grantService.publishCall(this.result.grantCall).subscribe(success=>{
                var temp:any = {};
                temp = success;
                this.showAddPointOfContact = false;
                this.addResearch = false;
                this.isEligibleAddopen = false;
                this.result.grantCall = temp.grantCall;
                this.mode='view';
                this.editClass="committeeBoxNotEditable";
            });
        }
        
    }

    navigate($event, mode) {
        this.router.navigate(['/proposal/createProposal'], { queryParams: {'grantId':this.result.grantCall.grantCallId,'mode': mode} });
    }
}
