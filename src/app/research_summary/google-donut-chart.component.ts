import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { GoogleChartService } from '../research_summary/google-chart.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { DashboardData } from '../dashboard/dashboard-data.service';
import { ExpandedviewService } from '../research_summary/expanded-view.service';
import { ExpandedViewDataService } from './expanded-view-data-service';

declare var google:any;

@Component({
  selector: 'donut-chart',
  template: `  
  <div id="donut_award_chart" class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6" (window:resize)="onResize($event)"></div>
  <div id="donut_proposal_chart" class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6" (window:resize)="onResize($event)"></div>`,
  providers: [GoogleChartService]
})

export class GoogleDonutChartComponent extends GoogleChartService {
    private proposalOptions;
    private awardOptions;
    private proposalData;
    private proposalChart;
    private awardChart;
    private awardData;
    private resultPie : any ={};
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

    constructor(private dashboardService : DashboardService, private router: Router,public expandedViewDataservice: ExpandedViewDataService, public dashboardData: DashboardData){
        super();
    }
    
    drawGraph(){
      setTimeout(() => {
      localStorage.setItem('donutChartIndex', null);
          this.resultPie = this.dashboardData.getDashboardPieChartData(); 
          if ( this.resultPie != null ){
              this.awardList = this.resultPie.summaryAwardDonutChart;
              this.awardStateList.push( [ 'Task', 'Hours per Day' ] );
              this.awardLength = this.awardList.length;
              this.proposalList = this.resultPie.summaryProposalDonutChart;
              this.proposalStateList.push( [ 'Task', 'Hours per Day' ] );
              this.proposalLength = this.proposalList.length;
              for (let i = 0; i < this.awardLength; i++){
                  this.statuscode.push( [this.awardList[i][0], this.awardList[i][1]] );
                  this.awardStateList.push([this.awardList[i][1], this.awardList[i][2]]);
              }
              this.awardData =  google.visualization.arrayToDataTable(this.awardStateList);
              this.awardOptions = {
                      title: 'Awarded Proposals by Sponsors',
                      legend: 'right',
                      colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                               '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                               '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                               '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'],
                      pieHole: 0.2,
              };
              this.awardChart = this.createPiChart(document.getElementById('donut_award_chart'));
              this.awardChart.draw(this.awardData, this.awardOptions);
              google.visualization.events.addListener( this.awardChart, 'select', ( event ) => {
                 
                  localStorage.setItem('donutChartIndex', 'AWARDED');
                      var selection = this.awardChart.getSelection();
                      for ( var i = 0; i < selection.length; i++ ) {
                          var item = selection[i];
                          if ( item.row != null ) {
                              this.sponsorType = this.awardData.getFormattedValue( item.row, 0 );
                              //this.expandedViewDataservice.personId = localStorage.getItem( 'personId' );
                              for ( let j = 0; j < this.statuscode.length; j++ ) {
                                  if ( this.sponsorType === this.statuscode[j][1] ) {
                                      localStorage.setItem('sponsorCode', this.statuscode[j][0]);
                                     /* this.expandedViewDataservice.sponsorCode = this.statuscode[j][0];*/
                                      localStorage.setItem('exapandedDonutViewAwardHeading', "Awards by " + this.sponsorType);
                                      /*this.expandedViewDataservice.exapandedViewAwardHeading = "Awards by " + this.sponsorType;*/
                                  } 
                              }
                          }
                      }
                      this.router.navigate( ['/expandedview'] );
                  } );
              google.visualization.events.addListener( this.awardChart, 'onmouseover', ( event ) => {
                  document.getElementById( 'donut_award_chart' ).style.cursor = 'pointer';
              } );
              google.visualization.events.addListener( this.awardChart, 'onmouseout', ( event ) => {
                  document.getElementById( 'donut_award_chart' ).style.cursor = '';
              } );          
              for (let j =0; j < this.proposalLength; j++){
                  this.proposalstatuscode.push( [this.proposalList[j][0], this.proposalList[j][1]] );
                  this.proposalStateList.push([this.proposalList[j][1], this.proposalList[j][2]]);
              }
              this.proposalData =  google.visualization.arrayToDataTable(this.proposalStateList);
              this.proposalOptions = {
                      title: 'In Progress Proposals by Sponsors',
                      colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                               '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                               '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                               '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'],
                      pieHole: 0.2,
              };
              this.proposalChart = this.createPiChart(document.getElementById('donut_proposal_chart'));
              this.proposalChart.draw(this.proposalData, this.proposalOptions);
              google.visualization.events.addListener( this.proposalChart, 'select', ( event ) => {
                  //this.expandedViewDataservice.piechartIndex = 'PROPOSAL';
                  localStorage.setItem('donutChartIndex', 'INPROGRESS');
                  var selection = this.proposalChart.getSelection();
                  for ( var i = 0; i < selection.length; i++ ) {
                      var item = selection[i];
                      if ( item.row != null ) {
                          this.proposalType = this.proposalData.getFormattedValue( item.row, 0 );
                          for ( let j = 0; j < this.proposalstatuscode.length; j++ ) {
                              if ( this.proposalType === this.proposalstatuscode[j][1] ) {
                                  localStorage.setItem('sponsorCode', this.proposalstatuscode[j][0]);
                                  localStorage.setItem('exapandedDonutViewProposalHeading', "Proposals by " + this.proposalType);
                              }
                          }
                      }
                  }
                  this.router.navigate( ['/expandedview'] );
              } );
              
              google.visualization.events.addListener( this.proposalChart, 'onmouseover', ( event ) => {
                  document.getElementById( 'donut_proposal_chart' ).style.cursor = 'pointer';
              } );
              google.visualization.events.addListener( this.proposalChart, 'onmouseout', ( event ) => {
                  document.getElementById( 'donut_proposal_chart' ).style.cursor = '';
              } );  
          }
        }, 1000)
    }
    
    onResize(event) {
        this.awardChart.draw(this.awardData, this.awardOptions);
        this.proposalChart.draw(this.proposalData, this.proposalOptions);
    }
} 
