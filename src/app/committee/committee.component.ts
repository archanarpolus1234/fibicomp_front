import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommitteCreateEditService } from './committee-create-edit.service';
import { CommitteeSaveService } from './committee-save.service';
import { CompleterService, CompleterData } from 'ng2-completer';

@Component({
  selector: 'app-committee',
  templateUrl: './committee.component.html',
  providers: [CommitteCreateEditService,CommitteeSaveService],
  styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
})
export class CommitteeComponent implements OnInit {
  currentTab: string = 'committee_home';
  schedule: boolean = false;
  mode: string;
  class: string;
  id: string;
  name: string;
  type: string;
  homeUnit: string;
  lastUpdated: string;
  homeUnits:any=[];
  result: any = {};
  homeUnitInput:any=[];
  editDetails:boolean = false;

  public dataServiceHomeUnit: CompleterData;

  constructor( public route: ActivatedRoute, public router: Router, public committeCreateService: CommitteCreateEditService, private completerService: CompleterService,  public committeeSaveService: CommitteeSaveService) {
      this.mode = this.route.snapshot.queryParamMap.get( 'mode' );
      if(this.mode == 'create')
          {
           this.editDetails = true;
           this.class = 'committeeBox';
          }
      else{
          this.class = 'committeeBoxNotEditable';
      }
  }
  
  ngOnInit(){ 
      if(this.mode=='view')
       {
          this.id = 'KC001';
          this.name = 'KC IRB 1';
          this.type = 'IRB';
          this.homeUnit = 'University';
          this.lastUpdated = '10/10/2017 by admin';
         }
    this.initialLoad();
  }
  initialLoad(){debugger;
      this.committeCreateService.getCommitteeData('1')
      .subscribe( data => {
          this.result = data || [];
          if ( this.result != null ) {
              this.homeUnits = this.result.homeUnits;
              console.log("sc");
              console.log(this.homeUnits);
              this.dataServiceHomeUnit = this.completerService.local(this.homeUnits, 'unitName', 'unitName');
          }
      } );
  }
  show_current_tab( e: any, current_tab ) {
      e.preventDefault();
      this.currentTab = current_tab;
  }
  areaChangeFunction(unitName){debugger;
  this.homeUnits.forEach((value, index) => {
      if(value.unitName == unitName){
          this.homeUnitInput.unitNumber = value.unitNumber;
      }
  }); 
}    

  onHomeSelect(){
  this.homeUnits.forEach((value, index) => {
      if(value.unitName == this.homeUnitInput.unitName){
          this.homeUnitInput.unitNumber = value.unitNumber;
      }
  }); 
  }
  
  saveDetails(){
      this.result.committee.homeUnitNumber = this.homeUnitInput.unitNumber;
      alert( this.result.committee.homeUnitNumber);
  }
}
