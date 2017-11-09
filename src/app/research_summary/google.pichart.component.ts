import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { GoogleChartService } from '../research_summary/google.chart.service';
import { DashboardService } from '../dashboard/dashboard.component.service';
import { ExpandedviewService } from '../research_summary/expandedview.service';
import { DataService } from './dataservice';

declare var google:any;

@Component({
  selector: 'pichart',
  template: `  
  <div id="pichart_award" class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6" (window:resize)="onResize($event)"></div>
  <div id="pichart_divEvolution" class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6" (window:resize)="onResize($event)"></div>`,
  providers: [GoogleChartService]
})

export class GooglePiChartComponent extends GoogleChartService {
    private proposalOptions;
    private awardOptions;
    private proposalData;
    private propsalChart;
    private awardChart;
    private awardData;
    private result : any ={};
    private awardList : any[];
    private proposalList : any[];
    private awardStateList : any[]=[];
    private awardLength : number;
    private proposalStateList : any[]=[];
    private proposalLength : number;
    private statuscode: any[] = [];
    private proposalstatuscode: any[] = [];
    private sponsorType: string;
    private proposalType: string;
    
    constructor(private dashboardService : DashboardService, private router: Router,public dataservice: DataService){
        super();
    }
    
    drawGraph(){
      this.dataservice.piechartIndex=null;
      this.dashboardService.getResearchSummaryData()
      .subscribe(data => {
          this.result = data || [];
          if ( this.result != null ){
              this.awardList = this.result.summaryAwardPieChart;
              this.awardStateList.push( [ 'Task', 'Hours per Day' ] );
              this.awardLength = this.awardList.length;
              this.proposalList = this.result.summaryProposalPieChart;
              this.proposalStateList.push( [ 'Task', 'Hours per Day' ] );
              this.proposalLength = this.proposalList.length;
              for (let i = 0; i < this.awardLength; i++){
                  this.statuscode.push( [this.awardList[i][0], this.awardList[i][1]] );
                  this.awardStateList.push([this.awardList[i][1], this.awardList[i][2]]);
              }
              this.awardData =  google.visualization.arrayToDataTable(this.awardStateList);
              this.awardOptions = {
                      title: 'Award by sponsor types',
                      is3D: true,
                      legend: 'right',
                      colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                               '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                               '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                               '#FF7143', '#8C6E63', '#BDBDBD', '#78909C']
              };
              this.awardChart = this.createPiChart(document.getElementById('pichart_award'));
              this.awardChart.draw(this.awardData, this.awardOptions);
              google.visualization.events.addListener( this.awardChart, 'select', ( event ) => {
                  this.dataservice.piechartIndex = 'AWARD';
                      var selection = this.awardChart.getSelection();
                      for ( var i = 0; i < selection.length; i++ ) {
                          var item = selection[i];
                          if ( item.row != null ) {
                              this.sponsorType = this.awardData.getFormattedValue( item.row, 0 );
                              this.dataservice.personId = localStorage.getItem( 'personId' );
                              for ( let j = 0; j < this.statuscode.length; j++ ) {
                                  if ( this.sponsorType === this.statuscode[j][1] ) {
                                      this.dataservice.sponsorCode = this.statuscode[j][0];
                                      this.dataservice.exapandedViewAwardHeading = "Awards by " + this.sponsorType;
                                  } 
                              }
                          }
                      }
                      this.router.navigate( ['/expandedview'] );
                  } );
              for (let j =0; j < this.proposalLength; j++){
                  this.proposalstatuscode.push( [this.proposalList[j][0], this.proposalList[j][1]] );
                  this.proposalStateList.push([this.proposalList[j][1], this.proposalList[j][2]]);
              }
              this.proposalData =  google.visualization.arrayToDataTable(this.proposalStateList);
              this.proposalOptions = {
                      title: 'Proposal by sponsor types',
                      is3D: true,
                      colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                               '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                               '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                               '#FF7143', '#8C6E63', '#BDBDBD', '#78909C']
              };
              this.propsalChart = this.createPiChart(document.getElementById('pichart_divEvolution'));
              this.propsalChart.draw(this.proposalData, this.proposalOptions);
              google.visualization.events.addListener( this.propsalChart, 'select', ( event ) => {
                  this.dataservice.piechartIndex = 'PROPOSAL';
                  var selection = this.propsalChart.getSelection();
                  for ( var i = 0; i < selection.length; i++ ) {
                      var item = selection[i];
                      if ( item.row != null ) {
                          this.proposalType = this.proposalData.getFormattedValue( item.row, 0 );
                          this.dataservice.personId = localStorage.getItem( 'personId' );
                          for ( let j = 0; j < this.proposalstatuscode.length; j++ ) {
                              console.log( 'status code :' + this.proposalstatuscode[j][1] );
                              console.log( 'Proposal Type is  :' + this.proposalType );
                              if ( this.proposalType === this.proposalstatuscode[j][1] ) {
                                  this.dataservice.sponsorCode = this.proposalstatuscode[j][0];
                                  this.dataservice.exapandedViewProposalHeading = "Proposals by " + this.proposalType;
                              }
                          }
                      }
                  }
                  this.router.navigate( ['/expandedview'] );
              } );
          }
         
      });
    }
    
    onResize(event) {
        this.awardChart.draw(this.awardData, this.awardOptions);
        this.propsalChart.draw(this.proposalData, this.proposalOptions);
    }
}
