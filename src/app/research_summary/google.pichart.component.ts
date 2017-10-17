/*
* http://usejsdoc.org/
*/
import { Component, OnInit} from '@angular/core';
import { GoogleChartService } from '../research_summary/google-chart.service';
declare var google:any;
@Component({
  selector: 'pichart',
  template: `<div id="pichart_divEvolution" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12" (window:resize)="onResize($event)"></div>`,
  providers: [GoogleChartService],
})
export class GooglePiChartComponent extends GoogleChartService {
    private options;
    private data;
    private chart;

    drawGraph(){
      this.data =  google.visualization.arrayToDataTable([
                                                          ['Task', 'Hours per Day'],
                                                          ['Work',     11],
                                                          ['Eat',      2],
                                                          ['Commute',  2],
                                                          ['Watch TV', 2],
                                                          ['Sleep',    7]
                                                        ]);

      this.options = {
              title: 'My Daily Activities',
              is3D: true,
      };

      this.chart = this.createPiChart(document.getElementById('pichart_divEvolution'));
      this.chart.draw(this.data, this.options);
    }
    onResize(event) {
        this.drawGraph();
    }
}
