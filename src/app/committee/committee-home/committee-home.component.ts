import { Component, OnInit,  Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteCreateEditService } from '../committee-create-edit.service';
import { CommitteeSaveService } from '../committee-save.service';
import { CompleterService, CompleterData } from 'ng2-completer';

@Component({
  selector: 'app-committee-home',
  templateUrl: './committee-home.component.html',
  providers: [CommitteCreateEditService, CommitteeSaveService],
  styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],
})
export class CommitteeHomeComponent implements OnInit {debugger;
  addResearch: boolean = false;
  editDetails : boolean = false;
  editResearch : boolean = false;
  reviewType : string;
  description : string;
  minMembers : string;
  advSubDays : string;
  errorFlag : boolean;
  error = '';
  addArea = '';
  areaOfReasearch :any = [];
  editClass: string;
  editAreaClass : string;
  maxProtocols : string; 
  mode: string;
  public areaInput : any = [];
  reviewTypes: any=[];
  slNo:number;
  public researchArea: any = {};
  public dataServiceArea: CompleterData;
  @Input() Id:string;
  @Input() Name:string;
  @Input() Type:string;
  @Input() Unit:string;
  
  areaList:any=[];
  result: any = {};
  resultSave: any = {};
  
  constructor(public route: ActivatedRoute, public router: Router, public committeCreateService: CommitteCreateEditService, private completerService: CompleterService, public committeeSaveService: CommitteeSaveService) {
      this.mode = this.route.snapshot.queryParamMap.get( 'mode' );
  }

  ngOnInit() {
      this.initialLoadChild();
      this.slNo = 0;
  }
  initialLoadChild(){
      this.committeCreateService.getCommitteeData('1')
      .subscribe( data => {
          this.result = data || [];
          if ( this.result != null ) {
              this.areaList = this.result.researchAreas;
              this.dataServiceArea = this.completerService.local(this.areaList, 'description', 'description');
            //  this.saveAreaOfResearch = this.result.committee.researchAreas;
              this.reviewTypes = this.result.reviewTypes;
          }
      } );
      
      if(this.mode == 'view'){
          this.errorFlag = false;
          this.editClass = 'committeeBoxNotEditable';
          this.editAreaClass = 'committeeBoxNotEditable';
          this.reviewType = 'Full';
          this.description = 'Test IRB Committee for Kuali Coeus';
          this.minMembers = '2';
          this.advSubDays = '2';
          this.maxProtocols = '2';
      }
      else {
          this.editClass = 'committeeBox';
          this.editAreaClass = 'committeeBox';
          this.editDetails = true;
      }
  }
 
  showaddAreaOfResearch(){
      this.addResearch = !this.addResearch;
  }
 
  showEditDetails(){
     this.editDetails = !this.editDetails; 
     if(this.editDetails){
         this.editClass = 'committeeBox';
     }
  }

  saveDetails(){debugger;
      if((this.minMembers == undefined || this.advSubDays == undefined || this.maxProtocols == undefined || this.Id == undefined || this.Type == undefined || this.Name == undefined || this.Unit == undefined) || (this.reviewType == 'Select')){debugger;
         this.errorFlag = true;
         this.error = 'please fill all the mandatory fileds' ;
      }
      else{
          this.error = '';
          this.result.committee.committeeId = this.Id;
          this.result.committee.committeeName = this.Name; 
          this.result.committee.committeeType.committeeTypeCode ='1';
          this.result.committee.homeUnitNumber = this.Unit;
          this.result.committee.description = this.description;
          this.result.committee.minimumMembersRequired = this.minMembers;
          this.result.committee.maxProtocols = this.maxProtocols;
          this.result.committee.advSubmissionDaysReq = this.advSubDays;
          this.result.updateType = 'SAVE';
          this.result.currentUser = 'admin';
          this.result.homeUnits = [];
          this.result.reviewTypes = [];
          this.result.researchAreas = [];
          this.editDetails = !this.editDetails; 
          console.log(this.result);
          if(!this.editDetails){
              this.editClass = 'committeeBoxNotEditable';
          }
          this.reviewTypes.forEach((value, index) => {
              if(value.description == this.reviewType){
                  this.result.committee.applicableReviewTypecode=value.reviewTypeCode;
              }
          });
          this.committeeSaveService.saveCommitteeData(this.result).subscribe( data => {
              this.resultSave = data || [];
          } ); 
      }
  }

  cancelEditDetails(){
      this.editDetails = !this.editDetails;
      this.initialLoadChild();
      if(!this.editDetails){
          this.editClass = 'committeeBoxNotEditable';
      }
  }

  addAreaOfResearch(){
      this.slNo++;
      this.editAreaClass = 'committeeBoxNotEditable';
      this.areaOfReasearch.push(this.areaInput);/*
      
      const index = this.areaList.findIndex(area => area.areaOfReasearch === this.areaInput.areaOfReasearch);
      this.areaList.splice(index, 1);*/
/*
      console.log(this.areaList);*/
      this.areaInput=[];/*
      console.log(this.areaOfReasearch);*/
          }
              
  showEditResearch(){
      this.editResearch = !this.editResearch; 
      if(this.editResearch){
          this.editAreaClass = 'committeeBox';
      }  
  }
  
  areaChangeFunction(description){
      this.areaList.forEach((value, index) => {
          if(value.description == description){
              this.areaInput.researchAreaCode = value.researchAreaCode;
              this.areaInput.description= value.description;
          }
      }); 
  }    

  onAreaSelect(){
      this.areaList.forEach((value, index) => {
          if(value.description == this.areaInput.description){
              this.areaInput.researchAreaCode = value.researchAreaCode;
          }
      }); 
      }

  saveEditResearch(){
      this.result.committee.researchAreas = [];
      console.log("hi11");
      console.log(this.areaOfReasearch);
      this.areaOfReasearch.forEach((value, index) => {debugger;
      this.result.committee.researchAreas.push(value);
      }); 
      alert(this.result.committee.researchAreas);
  }
}
