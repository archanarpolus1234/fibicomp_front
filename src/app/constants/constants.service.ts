import { Injectable } from '@angular/core';

@Injectable()
export class Constants {

    expandedSummaryViewUrl: string;
    expandedDonutViewUrl: string;
    expandedViewUrl: string;
    index_url: string;
    loginUrl: string;
    dashboardUrl: string;
    summaryUrl: string;
    notificationUrl: string;
    logoutUrl: string;
    outputPath: string;
    awardSummaryUrl:string;
    awardHierarchyUrl:string;
    awardTermsAndReportsUrl: string;
    commitmentsUrl: string;

    constructor() {
        this.index_url = 'http://192.168.1.76:9200/';

        this.loginUrl = '/login';
        //this.loginUrl = 'http://demo.fibiweb.com/fibi-comp/login';
        //this.loginUrl = 'http://192.168.1.76:8080/fibi-comp/login';

        this.dashboardUrl = '/fibiDashBoard';
        //this.dashboardUrl = 'http://demo.fibiweb.com/fibi-comp/fibiDashBoard';
       //this.dashboardUrl = 'http://192.168.1.76:8080/fibi-comp/fibiDashBoard';

        this.summaryUrl = '/getResearchSummaryData';
        //this.summaryUrl = 'http://demo.fibiweb.com/fibi-comp/getResearchSummaryData';
        //this.summaryUrl = 'http://192.168.1.76:8080/fibi-comp/getResearchSummaryData';

        this.notificationUrl = '/getUserNotification';
        //this.notificationUrl = 'http://demo.fibiweb.com/fibi-comp/getUserNotification';
        //this.notificationUrl = 'http://192.168.1.76:8080/fibi-comp/getUserNotification';

        this.logoutUrl = '/logout';
        //this.logoutUrl = 'http://demo.fibiweb.com/fibi-comp/logout'; 
        //this.logoutUrl = 'http://192.168.1.76:8080/fibi-comp/logout';

        this.expandedViewUrl = '/getPieChartDataByType';
        //this.expandedViewUrl = 'http://demo.fibiweb.com/fibi-comp/getPieChartDataByType';
        //this.expandedViewUrl = 'http://192.168.1.76:8080/fibi-comp/getPieChartDataByType';

        this.expandedSummaryViewUrl = '/getDetailedResearchSummary';
        //this.expandedSummaryViewUrl = 'http://demo.fibiweb.com/fibi-comp/getDetailedResearchSummary';
        //this.expandedSummaryViewUrl = 'http://192.168.1.76:8080/fibi-comp/getDetailedResearchSummary';

        this.expandedDonutViewUrl = '/getDonutChartDataBySponsor';
        //this.expandedDonutViewUrl = 'http://demo.fibiweb.com/fibi-comp/getDonutChartDataBySponsor';
        //this.expandedDonutViewUrl = 'http://192.168.1.76:8080/fibi-comp/getDonutChartDataBySponsor';

        this.awardSummaryUrl='/getAwardSummary';
        //this.awardSummaryUrl = 'http://demo.fibiweb.com/fibi-comp/getAwardSummary';
        //this.awardSummaryUrl = 'http://192.168.1.76:8080/fibi-comp/getAwardSummary';
        
        this.awardHierarchyUrl='/getAwardHierarchy';
        //this.awardHierarchyUrl = 'http://demo.fibiweb.com/fibi-comp/getAwardHierarchy';
        //this.awardHierarchyUrl = 'http://192.168.1.76:8080/fibi-comp/getAwardHierarchy';

        this.awardTermsAndReportsUrl = '/getAwardReportsAndTerms';
        //this.awardTermsAndReportsUrl = 'http://demo.fibiweb.com/fibi-comp/getAwardReportsAndTerms';
        //this.awardTermsAndReportsUrl = 'http://192.168.1.76:8080/fibi-comp/getAwardReportsAndTerms'; 
        
        this.commitmentsUrl = '/getAwardCommitments';
        //this.commitmentsUrl = 'http://demo.fibiweb.com/fibi-comp/getAwardCommitments';
        //this.commitmentsUrl = 'http://192.168.1.76:8080/fibi-comp/getAwardCommitments';
        
        //this.outputPath = 'http://192.168.1.242:8080/kc-dev';
        //this.outputPath = 'http://demo.fibiweb.com/kc-dev';
        this.outputPath = 'http://192.168.1.76:8080/kc-dev';
        //this.outputPath = 'http://192.168.1.72:8080/kc-dev';
    }
}
