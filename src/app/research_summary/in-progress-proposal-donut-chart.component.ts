import { Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';

import { GoogleChartService } from '../research_summary/google-chart.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { DashboardData } from '../dashboard/dashboard-data.service';
import { ExpandedviewService } from '../research_summary/expanded-view.service';
import { ExpandedViewDataService } from './expanded-view-data-service';
import { ISubscription } from "rxjs/Subscription";

declare var google:any;

@Component({
  selector: 'in-progress-proposal-donut-chart',
  template: `
  <div id="donut_proposal_chart" class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6" (window:resize)="onResize($event)"></div>`,
})

export class InProgressProposalDonutChartComponent extends GoogleChartService implements AfterViewInit, OnInit {
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

    ngAfterViewInit() { }

    ngOnDestroy() {
        if ( this.subscription )
            this.subscription.unsubscribe();
    }

    drawGraph() {
        localStorage.setItem( 'donutChartIndex', null );
        this.resultPie = this.dashboardData.getDashboardPieChartData();
        if ( this.resultPie != null && this.resultPie.summaryProposalDonutChart !== undefined ) {
            this.proposalList = this.resultPie.summaryProposalDonutChart;
            this.proposalStateList.push( ['Task', 'Hours per Day'] );
            this.proposalLength = this.proposalList.length;
            for ( let j = 0; j < this.proposalLength; j++ ) {
                this.proposalstatuscode.push( [this.proposalList[j][0], this.proposalList[j][1]] );
                this.proposalStateList.push( [this.proposalList[j][1], this.proposalList[j][2]] );
            }
            this.proposalData = google.visualization.arrayToDataTable( this.proposalStateList );
            this.proposalOptions = {
                title: 'In Progress Proposals By Sponsors',
                colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                    '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                    '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                    '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'],
                pieHole: 0.2,
            };
            this.proposalChart = this.createPiChart( document.getElementById( 'donut_proposal_chart' ) );
            this.proposalChart.draw( this.proposalData, this.proposalOptions );
            google.visualization.events.addListener( this.proposalChart, 'select', ( event ) => {
                localStorage.setItem( 'donutChartIndex', 'INPROGRESS' );
                var selection = this.proposalChart.getSelection();
                for ( var i = 0; i < selection.length; i++ ) {
                    var item = selection[i];
                    if ( item.row != null ) {
                        this.proposalType = this.proposalData.getFormattedValue( item.row, 0 );
                        for ( let j = 0; j < this.proposalstatuscode.length; j++ ) {
                            if ( this.proposalType === this.proposalstatuscode[j][1] ) {
                                localStorage.setItem( 'sponsorCode', this.proposalstatuscode[j][0] );
                                localStorage.setItem( 'exapandedDonutViewProposalHeading', "Proposals by " + this.proposalType );
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
    }

    onResize( event ) {
        if ( this.resultPie != null && this.resultPie.summaryProposalDonutChart !== undefined ) {
            this.proposalChart.draw( this.proposalData, this.proposalOptions );
        }
    }
} 
