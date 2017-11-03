import { Component, OnInit} from '@angular/core';

import { GoogleChartService } from '../research_summary/google.chart.service';
import { DashboardService } from '../dashboard/dashboard.component.service';

@Component({
  selector: 'display',
  template: `<div id="chart_divEvolution" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12" (window:resize)="onResize($event)"></div>`,
  providers: [GoogleChartService],
})

export class GoogleAreachartComponent extends GoogleChartService {
    private options;
    private data;
    private chart;
    private result : any ={};
    private researchSummaryList : any[];
    private directCost : any[];
    private fACost: any[];
    private areaChartList : any[]=[];
    private areachartLength : number;
    
    constructor( private dashboardService : DashboardService ){
        super();
    }
    
    drawGraph() {
        this.dashboardService.getResearchSummaryData()
        .subscribe(data => {
            this.result = data || [];
            this.researchSummaryList = this.result.expenditureVolumes;
            this.areaChartList.push( [ 'Year', 'Direct', 'FA' ] );
            this.areachartLength = this.researchSummaryList.length;
            for (let i = 0; i < this.areachartLength; i++){
                this.areaChartList.push([this.researchSummaryList[i][0], this.researchSummaryList[i][1], this.researchSummaryList[i][2]]);
            }
            this.data = this.createDataTable(this.areaChartList);
            this.options = {
                    hAxis: {
                      title: 'Year',
                      minValue: 0
                    },
                    legend: { position: 'top', alignment: 'end' }
                  };

                  this.chart = this.createAreaChart(document.getElementById('chart_divEvolution'));
                  this.chart.draw(this.data, this.options);
        });
    }
    
    onResize(event) {
        this.chart.draw(this.data, this.options);
    }
}
