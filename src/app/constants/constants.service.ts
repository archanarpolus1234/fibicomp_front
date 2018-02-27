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

    committeeCreateUrl: string;
    committeeSaveUrl: string;
    committeeViewUrl: string;
    researchAreaSaveUrl: string;
    deleteResearchAreaUrl: string;

    generateScheduleUrl: string;
    deleteScheduleUrl: string;
    filterScheduleUrl: string;
    resetFilterScheduleUrl: string;
    updateScheduleUrl: string;  

    addCommitteeMembership: string;
    saveCommitteeMembers: string;
    deleteMemberRoles: string;
    deleteMemberExpertise: string;
    deleteCommitteeMembers: string;
    saveCommitteeMembersRole: string;
    saveCommitteeMembersExpertise:string;
    updateMemberRoles:string;
    loadScheduleData: string;
    addOtherActions: string;
    deleteOtherActions: string;
    updateSchedule: string;
    addScheduleMinuteUrl: string;
    deleteScheduleMinuteUrl: string;

    constructor() {
        this.index_url = 'http://192.168.1.76:9200/';
        //this.index_url = 'http://52.20.110.7:9200/';
        
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


        this.committeeCreateUrl = '/createCommittee';
        //this.committeeCreateUrl = 'http://demo.fibziweb.com/fibi-comp/createCommittee';
        //this.committeeCreateUrl = 'http://192.168.1.76:8080/fibi-comp/createCommittee';   
         
         this.committeeSaveUrl = '/saveCommittee';
         //this.committeeSaveUrl = 'http://demo.fibiweb.com/fibi-comp/saveCommittee';
        //this.committeeSaveUrl = 'http://192.168.1.76:8080/fibi-comp/saveCommittee';  
         
         this.committeeViewUrl = '/loadCommitteeById';
         //this.committeeViewUrl = 'http://demo.fibiweb.com/fibi-comp/loadCommitteeById';
         //this.committeeViewUrl = 'http://192.168.1.76:8080/fibi-comp/loadCommitteeById';  
         
         this.researchAreaSaveUrl = '/saveAreaOfResearch';
         //this.researchAreaSaveUrl = 'http://demo.fibiweb.com/fibi-comp/saveAreaOfResearch';
         //this.researchAreaSaveUrl = 'http://192.168.1.76:8080/fibi-comp/saveAreaOfResearch';  
         
         this.deleteResearchAreaUrl = '/deleteAreaOfResearch';
         //this.deleteResearchAreaUrl = 'http://demo.fibiweb.com/fibi-comp/deleteAreaOfResearch';
         //this.deleteResearchAreaUrl = 'http://192.168.1.76:8080/fibi-comp/deleteAreaOfResearch';  
         
         this.addCommitteeMembership = '/addCommitteeMembership';
       //this.addCommitteeMembership = 'http://demo.fibiweb.com/fibi-comp/addCommitteeMembership';
         //this.addCommitteeMembership = 'http://192.168.1.76:8080/fibi-comp/addCommitteeMembership';  

         this.saveCommitteeMembers = '/saveCommitteeMembers';
         //this.saveCommitteeMembers = 'http://demo.fibiweb.com/fibi-comp/saveCommitteeMembers';
         //this.saveCommitteeMembers = 'http://192.168.1.76:8080/fibi-comp/saveCommitteeMembers';  
         
         this.generateScheduleUrl = '/addSchedule';
         //this.generateScheduleUrl = 'http://demo.fibiweb.com/fibi-comp/addSchedule';
         //this.generateScheduleUrl = 'http://192.168.1.76:8080/fibi-comp/addSchedule';
         
         this.deleteScheduleUrl = '/deleteSchedule';
         //this.deleteSchedsuleUrl = 'http://demo.fibiweb.com/fibi-comp/deleteSchedule';
         //this.deleteScheduleUrl = 'http://192.168.1.76:8080/fibi-comp/deleteSchedule';
         
         this.filterScheduleUrl = '/filterCommitteeScheduleDates';
         //this.filterScheduleUrl = 'http://demo.fibiweb.com/fibi-comp/filterCommitteeScheduleDates';
        // this.filterScheduleUrl = 'http://192.168.1.76:8080/fibi-comp/filterCommitteeScheduleDates';
         
         this.resetFilterScheduleUrl = '/resetCommitteeScheduleDates';
         //this.resetFilterScheduleUrl = 'http://demo.fibiweb.com/fibi-comp/resetCommitteeScheduleDates';
        // this.resetFilterScheduleUrl = 'http://192.168.1.76:8080/fibi-comp/resetCommitteeScheduleDates';
         
        this.updateScheduleUrl = '/updateCommitteeSchedule';
         //this.updateScheduleUrl = 'http://demo.fibiweb.com/fibi-comp/updateCommitteeSchedule';
        //  this.updateScheduleUrl = 'http://192.168.1.76:8080/fibi-comp/updateCommitteeSchedule';
         
         this.deleteMemberRoles = '/deleteMemberRoles';
         //this.deleteMemberRoles = 'http://demo.fibiweb.com/fibi-comp/deleteMemberRoles';
        //this.deleteMemberRoles = 'http://192.168.1.76:8080/fibi-comp/deleteMemberRoles';

        this.deleteMemberExpertise = '/deleteMemberExpertise';
         //this.deleteMemberExpertise = 'http://demo.fibiweb.com/fibi-comp/deleteMemberExpertise';
        //this.deleteMemberExpertise = 'http://192.168.1.76:8080/fibi-comp/deleteMemberExpertise';

         this.deleteCommitteeMembers = '/deleteCommitteeMembers';
         //this.deleteCommitteeMembers = 'http://demo.fibiweb.com/fibi-comp/deleteCommitteeMembers';
        //this.deleteCommitteeMembers = 'http://192.168.1.76:8080/fibi-comp/deleteCommitteeMembers';

        this.saveCommitteeMembersRole='/saveCommitteeMembersRole'
         //this.saveCommitteeMembersRole = 'http://demo.fibiweb.com/fibi-comp/saveCommitteeMembersRole';
        //this.saveCommitteeMembersRole = 'http://192.168.1.76:8080/fibi-comp/saveCommitteeMembersRole';

        this.saveCommitteeMembersExpertise='/saveCommitteeMembersExpertise'
         //this.saveCommitteeMembersExpertise = 'http://demo.fibiweb.com/fibi-comp/saveCommitteeMembersExpertise';
        //this.saveCommitteeMembersExpertise = 'http://192.168.1.76:8080/fibi-comp/saveCommitteeMembersExpertise';

         this.updateMemberRoles='/updateMemberRoles'
         //this.updateMemberRoles = 'http://demo.fibiweb.com/fibi-comp/updateMemberRoles';
        //this.updateMemberRoles = 'http://192.168.1.76:8080/fibi-comp/updateMemberRoles';
             
        this.loadScheduleData = '/loadScheduleById';
      //this.loadScheduleData = 'http://demo.fibiweb.com/fibi-comp/loadScheduleById';
        //this.loadScheduleData = 'http://192.168.1.76:8080/fibi-comp/loadScheduleById';
        
        this.addOtherActions = '/addOtherActions';
        //this.addOtherActions = 'http://demo.fibiweb.com/fibi-comp/addOtherActions';
          //this.addOtherActions = 'http://192.168.1.76:8080/fibi-comp/addOtherActions';
        
        this.deleteOtherActions = '/deleteOtherActions';
        //this.deleteOtherActions = 'http://demo.fibiweb.com/fibi-comp/deleteOtherActions';
          //this.deleteOtherActions = 'http://192.168.1.76:8080/fibi-comp/deleteOtherActions';
        
        this.updateSchedule = '/updateSchedule';
        //this.updateSchedule = 'http://demo.fibiweb.com/fibi-comp/updateSchedule';
        //this.updateSchedule = 'http://192.168.1.76:8080/fibi-comp/updateSchedule';

        this.addScheduleMinuteUrl = '/addCommitteeScheduleMinute';
        //this.addScheduleMinuteUrl = 'http://demo.fibiweb.com/fibi-comp/addCommitteeScheduleMinute';
          //this.addScheduleMinuteUrl = 'http://192.168.1.76:8080/fibi-comp/addCommitteeScheduleMinute';
        
        this.deleteScheduleMinuteUrl = '/deleteScheduleMinute';
        //this.deleteScheduleMinuteUrl = 'http://demo.fibiweb.com/fibi-comp/deleteScheduleMinute';
          //this.deleteScheduleMinuteUrl = 'http://192.168.1.76:8080/fibi-comp/deleteScheduleMinute';
        
        //this.outputPath = 'http://192.168.1.242:8080/kc-dev';
        //this.outputPath = 'http://demo.fibiweb.com/kc-dev';
        this.outputPath = 'http://192.168.1.76:8080/kc-dev';
        //this.outputPath = 'http://192.168.1.72:8080/kc-dev';
    }
}
