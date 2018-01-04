import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { GoogleChartService } from '../research_summary/google-chart.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { DashboardData } from '../dashboard/dashboard-data.service';
import { ExpandedviewService } from '../research_summary/expanded-view.service';
import { ExpandedViewDataService } from './expanded-view-data-service';

declare var google:any;

@Component({
  selector: 'proposal-by-sponsor-piechart',
  template: ` <div id="pichart_divEvolution" class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6" (window:resize)="onResize($event)"></div>`,
  providers: [GoogleChartService]
})

export class ProposalBySponsorPieChartComponent extends GoogleChartService {
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
      localStorage.setItem('piechartIndex', null);
          this.resultPie = this.dashboardData.getDashboardPieChartData(); 
          if ( this.resultPie != null ){
              this.proposalList = this.resultPie.summaryProposalPieChart;
              this.proposalStateList.push( [ 'Task', 'Hours per Day' ] );
              this.proposalLength = this.proposalList.length;      
              for (let j =0; j < this.proposalLength; j++){
                  this.proposalstatuscode.push( [this.proposalList[j][0], this.proposalList[j][1]] );
                  this.proposalStateList.push([this.proposalList[j][1], this.proposalList[j][2]]);
              }
              this.proposalData =  google.visualization.arrayToDataTable(this.proposalStateList);
              this.proposalOptions = {
                      title: 'Proposal By Sponsor Types',
                      is3D: true,
                      colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                               '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                               '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                               '#FF7143', '#8C6E63', '#BDBDBD', '#78909C']
              };
              this.proposalChart = this.createPiChart(document.getElementById('pichart_divEvolution'));
              this.proposalChart.draw(this.proposalData, this.proposalOptions);
              google.visualization.events.addListener( this.proposalChart, 'select', ( event ) => {
                  localStorage.setItem('piechartIndex', 'PROPOSAL');
                  var selection = this.proposalChart.getSelection();
                  for ( var i = 0; i < selection.length; i++ ) {
                      var item = selection[i];
                      if ( item.row != null ) {
                          this.proposalType = this.proposalData.getFormattedValue( item.row, 0 );
                          for ( let j = 0; j < this.proposalstatuscode.length; j++ ) {
                              if ( this.proposalType === this.proposalstatuscode[j][1] ) {
                                  localStorage.setItem('sponsorCode', this.proposalstatuscode[j][0]);
                                  localStorage.setItem('exapandedViewProposalHeading', "Proposals by " + this.proposalType);
                              }
                          }
                      }
                  }
                  this.router.navigate( ['/expandedview'] );
              } );
              
              google.visualization.events.addListener( this.proposalChart, 'onmouseover', ( event ) => {
                  document.getElementById( 'pichart_divEvolution' ).style.cursor = 'pointer';
              } );
              google.visualization.events.addListener( this.proposalChart, 'onmouseout', ( event ) => {
                  document.getElementById( 'pichart_divEvolution' ).style.cursor = '';
              } );  
          }
        }, 1000)
    }
    
    onResize(event) {
        this.proposalChart.draw(this.proposalData, this.proposalOptions);
    }
} 
