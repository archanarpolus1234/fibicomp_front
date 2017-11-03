import { Component, OnInit} from '@angular/core';

import { GoogleChartService } from '../research_summary/google.chart.service';
import { DashboardService } from '../dashboard/dashboard.component.service';

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
    
    constructor(private dashboardService : DashboardService){
        super();
    }
    
    drawGraph(){
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
              for (let j =0; j < this.proposalLength; j++){
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
          }
         
      });
    }
    
    onResize(event) {
        this.awardChart.draw(this.awardData, this.awardOptions);
        this.propsalChart.draw(this.proposalData, this.proposalOptions);
    }
}
