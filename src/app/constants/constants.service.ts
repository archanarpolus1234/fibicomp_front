import {Injectable } from '@angular/core';

@Injectable()
export class Constants {
	index_url : string;
	loginUrl : string;
	dashboardUrl : string;
	summaryUrl : string;
	notificationUrl : string;
	logoutUrl : string;
	outputPath:string;

    constructor() {
        this.index_url= 'http://192.168.1.76:9200/';
        
        this.loginUrl= '/login';
        //this.loginUrl = 'http://demo.fibiweb.com/fibi-comp/login';
        //this.loginUrl = 'http://192.168.1.76:8080/fibi-comp/login';
        
       this.dashboardUrl = '/fibiDashBoard';
       //this.dashboardUrl = 'http://demo.fibiweb.com/fibi-comp/fibiDashBoard';
       //this.dashboardUrl = 'http://192.168.1.76:8080/fibi-comp/fibiDashBoard';
       
       this.summaryUrl = '/getResearchSummaryData';
       //this.summaryUrl = 'http://192.168.1.76:8080/fibi-comp/getResearchSummaryData';
       //this.summaryUrl = 'http://demo.fibiweb.com/fibi-comp/getResearchSummaryData';
       
       this.notificationUrl = '/getUserNotification';
       //this.notificationUrl = 'http://demo.fibiweb.com/fibi-comp/getUserNotification';
       // this.notificationUrl = 'http://192.168.1.76:8080/fibi-comp/getUserNotification';
       
       this.logoutUrl = '/logout';
       //this.logoutUrl = 'http://demo.fibiweb.com/fibi-comp/logout';
       //this.logoutUrl = 'http://192.168.1.76:8080/fibi-comp/logout';
       
        //this.outputPath = 'http://192.168.1.242:8080/kc-dev';
       // this.outputPath = 'http://demo.fibiweb.com/kc-dev';
        this.outputPath = 'http://192.168.1.76:8080/kc-dev';
        //this.outputPath = 'http://192.168.1.72:8080/kc-dev';
       } 
}
