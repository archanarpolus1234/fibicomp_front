import { Component, OnDestroy,ChangeDetectionStrategy,ChangeDetectorRef, NgZone  } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'
import {Subscription} from 'rxjs/Subscription';
import { CompleterService, CompleterData } from 'ng2-completer';
import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { Subject } from 'rxjs';
import { Console } from '@angular/core/src/console';
import { FormsModule, FormGroup, FormControl, FormControlName } from '@angular/forms';

import { GrantService } from "./grant.service";
import { SessionManagementService } from '../session/session-management.service';
import { CommitteeMemberEmployeeElasticService } from '../elastic-search/committee-members-employees-elastic-search.service';


@Component( {
    selector: 'grant',
    templateUrl: 'grant.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css'],
    providers: [ CommitteeMemberEmployeeElasticService ],
    changeDetection: ChangeDetectionStrategy.Default
} )

export class GrantComponent {
    mode: string = "create";
    grantId: string ="";
    editClass: string = "committeeBox";
    pocClass: string = 'committeeBoxNotEditable';
    editAreaClass: string = 'scheduleBoxes';
    addResearch: boolean = false;
    showAddAttachment: boolean = false;
    isEligibleAddopen: boolean = false;
    showAddPointOfContact: boolean = false;
    editScheduleattachment: boolean = true;
    subscription: Subscription;
    result: any ={};
    status : string = "hello";
    keywordsList :  any  = [];
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
    areaList : any = [];
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
    keyWordWarningMessage: string;
    pocDuplicationMessage:boolean = false;
    eligibilityWarning:boolean = false;
    areaWarning:boolean = false;
    attachmentWarning:boolean = false;
    attachmentTypeWarning:boolean = false;
    isDateWarningText:boolean = false;
    dateWarningText:string = null;
    durInYears;durInMonths;durInDays;
    showSavedSuccessfully: boolean =false;
    homeUnits: any = [];
    selectedHomeUnit: string;
    isSMUChecked: boolean = true;
    searchActive: boolean = false;
    searchTextModel: string;
    message: string;
    searchText: FormControl = new FormControl( '' );
    elasticSearchresults: any[] = [];
    hits_source: any;
    fullName: any;
    prncpl_id: string;
    _results: any;
    iconClass: string;

    constructor( public changeRef :ChangeDetectorRef, public _ngZone: NgZone, public committeeMemberEmployeeElasticService: CommitteeMemberEmployeeElasticService, public completerService : CompleterService, public router : Router,public route : ActivatedRoute, private grantService: GrantService, private sessionService: SessionManagementService) {
        if ( !sessionService.canActivate() ) {
            localStorage.setItem('currentUrl', window.location.href);
            this.router.navigate( ['/loginpage'] );
        }
        this.result.grantCall = {};
    }

    ngOnInit() { 
     this.currentDate.setDate(this.currentDate.getDate()-1);
       this.grantId = this.route.snapshot.queryParamMap.get('grantId');
        if(this.grantId==null) {
            this.mode='create';
            this.editClass="committeeBox";
            this.pocClass = this.isSMUChecked ? 'committeeBoxNotEditable': 'committeeBox';
            this.editAreaClass = 'scheduleBoxes';
            this.loadGrantInitData();
        } else {
            this.grantService.loadGrantById(this.grantId).takeUntil(this.onDestroy$).subscribe(response=>{ 
                        this.result = response;
                        this.changeRef.detectChanges();
                        
                        if(this.result.grantCall.grantCallStatus.description == 'Draft') {
                            this.mode = 'edit';
                            this.editClass="committeeBox";
                            this.pocClass = this.isSMUChecked ? 'committeeBoxNotEditable': 'committeeBox';
                            this.editAreaClass = 'scheduleBoxes';
                            this.dateValidation();
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
                           this.homeUnits =  this.completerService.local( this.result.homeUnits, 'unitName', 'unitName' )
                           this.selectedHomeUnit = this.result.grantCall.homeUnitName;
                        } else {
                            this.mode='view';
                            this.editClass="committeeBoxNotEditable";
                            this.pocClass = this.isSMUChecked ? 'committeeBoxNotEditable': 'committeeBox';
                            this.editAreaClass = 'scheduleBoxes';
                            this.selectedHomeUnit = this.result.grantCall.homeUnitName;
                        }
                        
                        //placing list from loaded grantCall 
                        this.keywordDisplayList = this.result.grantCall.grantCallKeywords;
                        this.eligibilityList =  this.result.grantCall.grantCallEligibilities;
                        this.grantCallTypeSelected = this.result.grantCall.grantCallType.description;
                    },error=>{
                    }); 
        }
     
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
                        this._ngZone.runOutsideAngular(() => {
                            this.committeeMemberEmployeeElasticService.search( searchString )
                                .then(( searchResult ) => {
                                    this.elasticSearchresults = [];
                                    this._ngZone.run(() => {
                                        this.hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );

                                        this.hits_source.forEach(( elmnt, j ) => {
                                            this.prncpl_id = this.hits_source[j].prncpl_id;
                                            this.fullName = this.hits_source[j].full_name;
                                            this.elasticSearchresults.push( {
                                                label: this.fullName,
                                                id: this.prncpl_id,
                                                data: this.hits_source[j]
                                            } );
                                        } );
                                        if ( this.elasticSearchresults.length > 0 ) {
                                            this.message = '';
                                        } else if ( this.searchTextModel && this.searchTextModel.trim() ) {
                                            this.message = '';
                                        }
                                        resolve( this.elasticSearchresults );
                                    } );

                                } )
                                .catch(( error ) => {
                                    alert( "catch error" );
                                } );
                        } );
                } );
            } )
            .catch( this.handleError )
            .takeUntil( this.onDestroy$ ).subscribe( this._results );
    }

    handleError(): any {
        this.message = 'something went wrong';
    }

    selected( value ) {
        this.searchTextModel = value.label;
        this.pointOfContactObject = {};
        this.pointOfContactObject.fullName = value.data.full_name;
        this.pointOfContactObject.email = value.data.email_addr;
        this.pointOfContactObject.mobile = value.data.phone_nbr;
        this.pointOfContactObject.designation = '';
        this.message = '';
    }

    //elastic search value change
    onSearchValueChange() {
        this.iconClass = this.searchTextModel ? 'fa fa-times fa-med' : '';
        this.elasticSearchresults = [];
    }

    clearSearchBox( e ) {
        e.preventDefault();
        this.searchTextModel = '';
        this.pointOfContactObject = {};
    }


    differenceBetweenDates( startDate, endDate ) {
        if(startDate == null ) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Select a opening date';
        } else if(startDate> endDate) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Opening date is after closing date';
        }
        if ( startDate != null && endDate != null && startDate <= endDate ) { 
        var diffInMs = Math.round( Date.parse( endDate ) - Date.parse( startDate ) );
        // diffInMs = Math.round(1523507183000); for testing
        var difference = Math.floor( diffInMs / 1000 / 60 / 60 / 24 | 0 );
        this.durInYears = Math.floor( difference / 365 | 0 );
        difference = Math.floor( difference % 365 | 0 )
        this.durInMonths = Math.floor( difference / 31 | 0 );
        this.durInDays = Math.floor( difference % 31 | 0 );
        }
    }

    dateValidation() {
        if ( this.result.grantCall.openingDate == null ) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a opening date';
        } else if ( new Date(this.result.grantCall.openingDate) < this.currentDate ) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a opening date from today';
        } else if ( this.result.grantCall.openingDate != null && this.result.grantCall.closingDate != null && new Date(this.result.grantCall.openingDate) <= new Date(this.result.grantCall.closingDate) ) {
            this.isDateWarningText = false;
            this.differenceBetweenDates( this.result.grantCall.openingDate, this.result.grantCall.closingDate );
            
        } else if ( this.result.grantCall.closingDate == null ) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a closing date';
        } else if ( new Date(this.result.grantCall.openingDate) > new Date(this.result.grantCall.closingDate) ) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a closing date after opening date';
        } else if ( this.result.grantCall.openingDate != null && this.result.grantCall.closingDate != null && new Date(this.result.grantCall.openingDate) <= new Date(this.result.grantCall.closingDate) ) {
            this.isDateWarningText = false;
            this.differenceBetweenDates( this.result.grantCall.openingDate, this.result.grantCall.closingDate );
           
        } else {
            this.isDateWarningText = false;
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
                this.selectedSponsor = temp.sponsors[0].sponsorName;
                this.selectedActivityType = this.result.activityTypes[0].description;
                this.selectedFundingType =  this.result.fundingSourceTypes[0].description;
                this.sponsorTypeChange( this.selectedSponsorType);
                this.sponsorNameChange( this.selectedSponsor);
                this.researchTypeChange(this.selectedActivityType)
                this.fundingTypeChange(this.selectedFundingType);
            });
           this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' )
           this.areaList = this.completerService.local( this.result.researchAreas, 'description', 'description' )
           this.homeUnits =  this.completerService.local( this.result.homeUnits, 'unitName', 'unitName' )
        });
    }
    showaddPointOfContact() {
        this.showAddPointOfContact = !this.showAddPointOfContact;
    }
    
    addPointOfContact(pointOfContactObject) {
        this.pocDuplicationMessage = false;
        if(this.validateEmailAndMobile(this.pointOfContactObject.email.trim(),this.pointOfContactObject.mobile) && this.pointOfContactObject.fullName.trim().length>0 ) {
            if(this.result.grantCall.grantCallContacts.length!=0) {
            for(let poc of this.result.grantCall.grantCallContacts) {
                if(poc.email.trim() == this.pointOfContactObject.email.trim()) {
                    this.pocDuplicationMessage = true;
                } 
            }
            }
            
            if(this.pocDuplicationMessage == false) {
                this.pointOfContactObject.personId = "";
            this.result.grantCall.grantCallContacts.push(pointOfContactObject);
            this.pointOfContactObject = {};
            this.searchTextModel = '';
            this.valid = true;
            this.changeRef.detectChanges();
            } 
        }else {
            this.validationError = "Fields are incorrect or not filled";
            this.valid = false;
        }
       
    }
    validateEmailAndMobile(mail,mobile) {
		if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail) )
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
       this.eligibilityWarning= false;
        if(this.selectedCriteria == null || this.selectedEligibilityType == null) {
          
        } else {
                    for(let eligibility of this.result.grantCall.grantCallEligibilities) {
                        if(eligibility.grantCallCriteria.description  == this.selectedCriteria && eligibility.grantCallEligibilityType.description == this.selectedEligibilityType) {
                        this.eligibilityWarning = true; break;
                        } 
                    }
            
            if(this.eligibilityWarning == false) {
                label:for(let criteria of this.result.grantCallCriterias) {
                    if(this.selectedCriteria == criteria.description) {
                        tempObj.grantCriteriaCode = criteria.grantCriteriaCode;
                        tempObj.grantCallCriteria= criteria;
                        for(let type of this.result.grantCallEligibilityTypes) {
                            if(this.selectedEligibilityType == type.description) {
                                tempObj.grantEligibilityTypeCode = type.grantEligibilityTypeCode;
                                tempObj.grantCallEligibilityType = type;
                                tempObj.updateTimestamp = timestamp;
                                tempObj.updateUser = this.currentUser;
                                this.result.grantCall.grantCallEligibilities.push(tempObj); break label;
    
                            }
                        }
    
                    }
                }
            }
        }
        this.selectedCriteria = "Select";
        this.selectedEligibilityType = "Select";
       
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
        this.attachmentWarning = false;
        this.attachmentTypeWarning = false;
        if(this.result.grantCall.grantCallAttachments.length!=0) {
            if( this.uploadedFile.length!=0) {
                label: for (let attachment of this.result.grantCall.grantCallAttachments) {
                    for(let file of this.uploadedFile) {
                        if(attachment.fileName == file.name) {
                            this.attachmentWarning = true;
                            break label;
                        }
                    }
                    
                }
            }
         
        }
        if(this.attachmentWarning == false) {
            var timestamp = d.getTime();
            var tempObjectForAdd:any = {};
            
            if(this.attachmentObject.description!=null) { 
                this.attachmentTypeWarning = false;
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
                
            } else {
                this.attachmentTypeWarning = true;
            }
           
        }
      
        
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
                this.sponsorNameChange(this.selectedSponsor);
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
        var keywordFlag:boolean = false;
          for(let word of this.result.grantCall.grantCallKeywords) {
                if(word.scienceKeyword.description == this.selectedKeyword) {
                    keywordFlag = true;
                    this.keyWordWarningMessage = "Keyword already added";
                    break;
                } 
            }
            if(keywordFlag ==false) {
                for(let keyword of this.result.scienceKeywords) {
                    if(keyword.description == this.selectedKeyword) {
                       this.keywordObject.scienceKeywordCode = keyword.code;
                       this.keywordObject.scienceKeyword = keyword;
                       this.keywordObject.updateTimestamp = timeStamp;
                       this.keywordObject.updateUser = this.currentUser;
                       this.result.grantCall.grantCallKeywords.push(this.keywordObject);
                       this.keyWordWarningMessage = null;
                       break;
                    }
                }
            } else{
                this.keyWordWarningMessage = "Keyword already added";
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
        
        if(this.result.grantCall.grantCallType==null || this.result.grantCall.grantCallStatus == null || this.result.grantCall.grantCallName.trim() == null || this.result.grantCall.openingDate == null || this.result.grantCall.closingDate == null || this.result.grantCall.description.trim() == null || this.result.grantCall.maximumBudget == null || this.isDateWarningText == true || this.result.grantCall.grantTheme==null) {
            var scrollTop;
            this.showWarning = true;
            this.showSavedSuccessfully = false;
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
            this.showSavedSuccessfully = true;
            this.keyWordWarningMessage = null;
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
                },()=>{
                     //Scroll to Top Javascript Function
             scrollTop = setInterval(function(){ 
                if(document.body.scrollTop == document.documentElement.scrollTop) {
                    clearInterval(scrollTop);
                }
                document.body.scrollTop = document.documentElement.scrollTop -=10 ; }, 1000/30);
             
                });
                setTimeout(()=> {
                    this.showSavedSuccessfully = false;
                   
                },8000);
                
        }
       
    }

    addResearchArea() {
        var d =new Date();
        var timeStamp = d.getTime(); 
        this.areaWarning = false;
        if(this.result.grantCall.grantCallResearchAreas.length!=0) {
           for(let area of this.result.grantCall.grantCallResearchAreas) {
               if(area.researchArea.description == this.selectedResearchArea) {
                   this.areaWarning = true; break;
               }
           }
        }
       if(this.areaWarning == false) {
        for(let researchArea of this.result.researchAreas) {
            if(researchArea.description == this.selectedResearchArea) {
                var tempObj:any = {};
                tempObj.researchAreaCode = researchArea.researchAreaCode;
                tempObj.researchArea  = researchArea;
                tempObj.updateTimestamp = timeStamp;
                tempObj.updateUser = this.currentUser;
                this.result.grantCall.grantCallResearchAreas.push(tempObj); break;
            }
        }
       }
       this.selectedResearchArea = null;
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
                    
        if(this.result.grantCall.grantCallId ==null || this.result.grantCall.grantCallType==null || this.result.grantCall.grantCallStatus == null || this.result.grantCall.grantCallName.trim() == null || this.result.grantCall.openingDate == null || this.result.grantCall.closingDate == null || this.result.grantCall.description.trim() == null || this.result.grantCall.maximumBudget == null || this.isDateWarningText == true || this.result.grantCall.grantTheme==null ) {
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
            this.keyWordWarningMessage = null;
            this.grantService.publishCall(this.result.grantCall).subscribe(success=>{
                var temp:any = {};
                temp = success;
                this.showAddPointOfContact = false;
                this.addResearch = false;
                this.isEligibleAddopen = false;
                this.result.grantCall = temp.grantCall;
                this.mode='view';
                this.editClass="committeeBoxNotEditable";
                this.pocClass = this.isSMUChecked ? 'committeeBoxNotEditable': 'committeeBox';
                this.editAreaClass = 'scheduleBoxes';
            });
        }
        
    }

    navigate($event, mode) {
        this.router.navigate(['/proposal/createProposal'], { queryParams: {'grantId':this.result.grantCall.grantCallId,'mode': mode} });
    }

    homeUnitChangeFunction() {
        
       for(let homeUnit of this.result.homeUnits){
            if ( homeUnit.unitName == this.selectedHomeUnit ) {
                this.result.grantCall.homeUnitNumber = homeUnit.unitNumber;
                this.result.grantCall.homeUnitName = this.selectedHomeUnit;
            }
        }
    }

    personTypeChanged(value) {
        this.isSMUChecked = value;
        if ( this.isSMUChecked ) {
            this.pocClass = 'committeeBoxNotEditable';
        } else {
            this.pocClass = 'committeeBox';
        }
    }
    
}
