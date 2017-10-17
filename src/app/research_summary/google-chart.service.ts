import { Injectable, OnInit } from '@angular/core';
declare var google:any;
@Injectable()
export class GoogleChartService implements OnInit{

    private static googleLoaded:any;

    constructor(){
        //console.log("Here is GoogleChartComponent");
    }

    getGoogle() {
        return google;
    }
    ngOnInit() {
      //console.log('ngOnInit');
      if(!GoogleChartService.googleLoaded) {
          //console.log('ngOnInit');
          GoogleChartService.googleLoaded = true;
        google.charts.load('current',  {packages: ['corechart', 'bar']});
      }
      google.charts.setOnLoadCallback(() => this.drawGraph());
    }

    drawGraph(){
        //console.log("DrawGraph base class!!!! ");
    }

    createAreaChart(element:any):any {
        return new google.visualization.AreaChart(element);
    }

    createDataTable(array:any[]):any {
        return google.visualization.arrayToDataTable(array);
    }
    createPiChart(element:any):any {
        return new google.visualization.PieChart(element);
    }
}
