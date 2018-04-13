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
    selector: 'award-by-sponsor-piechart',
    template: `  
  <div id="pichart_award" class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6" (window:resize)="onResize($event)"></div>`,
} )

export class AwardBySponsorPieChartComponent extends GoogleChartService implements OnInit {
    private proposalOptions;
    private awardOptions;
    private proposalData;
    private proposalChart;
    private awardChart;
    private awardData;
    private resultPie: any = {};
    private awardList: any[];
    private proposalList: any[];
    private awardStateList: any[] = [];
    private awardLength: number;
    private proposalStateList: any[] = [];
    private proposalLength: number;
    private statuscode: any[] = [];
    private proposalstatuscode: any[] = [];
    private sponsorType: string;
    private proposalType: string;

    private subscription: ISubscription;

    constructor( private ref: ChangeDetectorRef, private dashboardService: DashboardService, private router: Router, public expandedViewDataservice: ExpandedViewDataService, public dashboardData: DashboardData ) {
        super();
    }

    ngOnInit() {
        this.subscription = this.dashboardData.dashboardPieChartData1Variable.subscribe( dashboardPieChartData1 => {
            if ( dashboardPieChartData1.summaryAwardPieChart != undefined ) {
                this.resultPie = dashboardPieChartData1;
                super.googleChartFunction();
            }
            this.ref.detectChanges();
        } );

    }

    ngOnDestroy() {
        if ( this.subscription )
            this.subscription.unsubscribe();
        this.resultPie = {};
    }

    drawGraph() {
        this.expandedViewDataservice.setPiechartIndex('');
        this.expandedViewDataservice.setResearchSummaryIndex('');
        this.resultPie = this.dashboardData.getDashboardPieChartData();
        if ( this.resultPie != null && this.resultPie.summaryAwardPieChart !== undefined ) {
            this.awardList = this.resultPie.summaryAwardPieChart;
            this.awardStateList.push( ['Task', 'Hours per Day'] );
            this.awardLength = this.awardList.length;
            for ( let i = 0; i < this.awardLength; i++ ) {
                this.statuscode.push( [this.awardList[i][0], this.awardList[i][1]] );
                this.awardStateList.push( [this.awardList[i][1], this.awardList[i][2]] );
            }
            this.awardData = google.visualization.arrayToDataTable( this.awardStateList );
            this.awardOptions = {
                title: 'Award By Sponsor Types',
                is3D: true,
                legend: 'right',
                colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                    '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                    '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                    '#FF7143', '#8C6E63', '#BDBDBD', '#78909C']
            };
            this.awardChart = this.createPiChart( document.getElementById( 'pichart_award' ) );
            this.awardChart.draw( this.awardData, this.awardOptions );
            google.visualization.events.addListener( this.awardChart, 'select', ( event ) => {
                this.expandedViewDataservice.setPiechartIndex( 'AWARD');
                var selection = this.awardChart.getSelection();
                for ( var i = 0; i < selection.length; i++ ) {
                    var item = selection[i];
                    if ( item.row != null ) {
                        this.sponsorType = this.awardData.getFormattedValue( item.row, 0 );
                        for ( let j = 0; j < this.statuscode.length; j++ ) {
                            if ( this.sponsorType === this.statuscode[j][1] ) {
                                this.expandedViewDataservice.setSponsorCode(this.statuscode[j][0]);
                                this.expandedViewDataservice.setExpandedViewAwardHeading( "Awards by " + this.sponsorType);
                            }
                        }
                    }
                }
                this.router.navigate( ['/expandedview'] );
            } );
            google.visualization.events.addListener( this.awardChart, 'onmouseover', ( event ) => {
                document.getElementById( 'pichart_award' ).style.cursor = 'pointer';
            } );
            google.visualization.events.addListener( this.awardChart, 'onmouseout', ( event ) => {
                document.getElementById( 'pichart_award' ).style.cursor = '';
            } );
        }
    }

    onResize( event ) {
        this.awardChart.draw( this.awardData, this.awardOptions );
    }
} 
