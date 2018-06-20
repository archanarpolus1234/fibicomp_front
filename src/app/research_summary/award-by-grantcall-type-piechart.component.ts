import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { GoogleChartService } from '../research_summary/google-chart.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { DashboardData } from '../dashboard/dashboard-data.service';
import { ExpandedviewService } from '../research_summary/expanded-view.service';
import { ExpandedViewDataService } from './expanded-view-data-service';
import { ISubscription } from "rxjs/Subscription";

declare var google: any;

@Component( {
    selector: 'award-by-grantcall-type-piechart',
    template: `  
  <div id="pichart_awardgrantcall" class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4" (window:resize)="onResize($event)"></div>`,
} )

export class AwardByGrantcallTypePieChartComponent extends GoogleChartService implements OnInit {
    private piechartOptions;
    private grantCallChart;
    private piechartDrawData;
    private resultPie: any = {};
    private piechartList: any[];
    private proposalList: any[];
    private piechartDrawList: any[] = [];

    private subscription: ISubscription;

    constructor( private ref: ChangeDetectorRef, private dashboardService: DashboardService, private router: Router, public expandedViewDataservice: ExpandedViewDataService, public dashboardData: DashboardData ) {
        super();
    }

    ngOnInit() {
       this.subscription = this.dashboardData.reportDataVariable.subscribe( dashboardReportData => {
            if ( dashboardReportData.awardByGrantType != undefined ) {
                this.resultPie = dashboardReportData;
                super.googleChartFunction();
            }
            this.ref.detectChanges();
        } );
    }

    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.resultPie = {}; }
    }

    drawGraph() {
        this.resultPie = this.dashboardData.getReportData();
        if ( this.resultPie != null && this.resultPie._value.awardByGrantType !== undefined ) {
            let tempObject: any = {};
            tempObject = this.resultPie._value.awardByGrantType;
            this.piechartList = Object.entries(tempObject).map(([key, value]) => ([key,value]));
            //this.awardList = this.resultPie._value.applicationsByGrantCallType;
            this.piechartDrawList = [];
            this.piechartDrawList.push( ['Type', 'Count'] );
            let length = this.piechartList.length;
            for ( let i = 0; i < length; i++ ) {
                this.piechartDrawList.push( [this.piechartList[i][0], this.piechartList[i][1]] );
            }
            this.piechartDrawData = google.visualization.arrayToDataTable( this.piechartDrawList );
            this.piechartOptions = {
                title: '',
                legend: { position: 'right', alignment: 'center', textStyle: {color: '#424242', fontSize: 13, fontName: 'Segoe UI'} },
                chartArea: { width:'120%', height:'120%'},
                is3D: true,
                colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                    '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                    '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                    '#FF7143', '#8C6E63', '#BDBDBD', '#78909C']
            };
            this.grantCallChart = this.createPiChart( document.getElementById( 'pichart_awardgrantcall' ) );
            this.grantCallChart.draw( this.piechartDrawData, this.piechartOptions );
        }
    }

    onResize( event ) {
        this.grantCallChart.draw( this.piechartDrawData, this.piechartOptions );
    }
} 
