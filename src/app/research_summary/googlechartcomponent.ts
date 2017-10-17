import { Component, OnInit} from '@angular/core';
import { GoogleChartService } from '../research_summary/google-chart.service';
@Component({
  selector: 'display',
  template: `<div id="chart_divEvolution" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12" (window:resize)="onResize($event)"></div>
  <div id="Pichart_divEvolution" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12" (window:resize)="onResize($event)"></div>`,
  providers: [GoogleChartService],
})
export class GoogleChartComponent extends GoogleChartService {
    private options;
    private data;
    private chart;

    drawGraph(){
      //console.log('DrawGraph Evolution...');
      this.data = this.createDataTable([
                                        ['Year', 'Direct', 'FA', 'Sub-Award'],
                                        ['2014',  1170, 460, 120],
                                        ['2015',  660, 1120, 150],
                                        ['2016',  1030, 540, 130],
                                        ['2017',  758, 654, 129]
                                    ]);

      this.options = {
       /* title: 'Expenditure Volume',*/
        
        hAxis: {
          title: 'Year',
          minValue: 0
        },
        legend: { position: 'top', alignment: 'end' }
      };

      this.chart = this.createAreaChart(document.getElementById('chart_divEvolution'));
    //  this.chart = this.createPiChart(document.getElementById('Pichart_divEvolution'));
      this.chart.draw(this.data, this.options);
    }
    onResize(event) {
        this.drawGraph();
    }
}
