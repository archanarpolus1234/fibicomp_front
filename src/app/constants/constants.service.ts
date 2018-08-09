import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
    //baseUrl : string = "http://192.168.1.76";
    //baseUrl : string = "http://52.20.110.7";
    //baseUrl : string = "http://14.140.179.70";
    baseUrl : string = "http://demo.fibiweb.com/fibi-comp";
    //baseUrl: string = "";

    //portAndPath: string = ":8080/fibi-comp";
    //portAndPath: string = ":1550/fibi-comp";
    portAndPath: string = "";

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
    outputPathAB: string;
    outputPathOST: string;
    awardSummaryUrl: string;
    awardHierarchyUrl: string;
    awardTermsAndReportsUrl: string;
    commitmentsUrl: string;

    committeeCreateUrl: string;
    committeeSaveUrl: string;
    committeeViewUrl: string;
    researchAreaSaveUrl: string;
    deleteResearchAreaUrl: string;

    generateScheduleUrl: string;
    updateSchedule: string;
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
    saveCommitteeMembersExpertise: string;
    updateMemberRoles: string;
    loadScheduleData: string;
    addOtherActions: string;
    addScheduleAttachment: string;
    deleteScheduleAttachment: string;
    downloadAttachments: string;
    updateScheduleAttachments: string;
    deleteOtherActions: string;
    addScheduleMinuteUrl: string;
    deleteScheduleMinuteUrl: string;
    updateScheduleMinuteUrl: string;
    addGuestMember: string;
    updateScheduleAttendanceData: string;
    deleteGuestMenberScheduleAttendance: string;
    saveOrUpdateGrantCall: string;
    fetchSponsorsBySponsorType: string;
    loadGrantCallById: string;
    deleteGrantCallKeyword: string;
    deleteGrantCallContact: string;
    deleteGrantCallAreaOfResearch: string;
    deleteGrantCallEligibility: string;
    addGrantCallAttachment: string;
    saveUpdateGrantCall: string;
    deleteGrantCallAttachment: string;
    downloadGrantCallAttachment: string;
    publishGrantCall: string;
    addProposalAttachment: string;
    deleteProposalAttachment: string;
    saveOrUpdateProposal: string;
    downloadProposalAttachment: string;
    deleteProposalResearchArea: string;
    deleteIrbProtocol: string;
    createGrantCalls: string;
    createProposalUrl: string;
    deleteProposalSponsor: string;
    deleteProposalPersonUrl: string;
    deleteBudgetUrl: string;
    deleteProposalKeywordUrl: string;
    fetchCostElementUrl: string;
    loadProposalById: string;
    submitProposalUrl: string;
    approveRejectProposalUrl: string;
    downloadRoutelogAttachmentUrl: string;
    addReviewerUrl: string;
    completeReviewUrl: string;
    applicationReport: string;
    fetchOpenGrantIds: string;
    fetchReviewerUrl: string;
    removeAssignedReviewerUrl: string;
    submitEndorsementUrl: string;
    approveByProvost: string;
    IRBOutputPath: string;
    projectVariationRequestUrl: string;
    viewTemplateUrl: string;
    getContractAdminUrl: string;
    submitOSTDetailsUrl: string;
    createProposalBudgetUrl: string;
    getBudgetRatesUrl: string;
    autoCalculateUrl: string;
    resetBudgetRatesUrl: string;
    getSyncBudgetRatesUrl: string;
    deleteBudgetLineItemUrl: string;
    deleteBudgetPeriodUrl: string;
    printProposalUrl: string;


    constructor() {
        //this.index_url = 'http://192.168.1.76:9200/';
        this.index_url = 'http://52.20.110.7:9200/';

        this.loginUrl = this.baseUrl + this.portAndPath + '/login';

        this.dashboardUrl = this.baseUrl + this.portAndPath + '/fibiDashBoard';

        this.summaryUrl = this.baseUrl + this.portAndPath + '/getResearchSummaryData';

        this.notificationUrl = this.baseUrl + this.portAndPath + '/getUserNotification';

        this.logoutUrl = this.baseUrl + this.portAndPath + '/logout';

        this.expandedViewUrl = this.baseUrl + this.portAndPath + '/getPieChartDataByType';

        this.expandedSummaryViewUrl = this.baseUrl + this.portAndPath + '/getDetailedResearchSummary';

        this.expandedDonutViewUrl = this.baseUrl + this.portAndPath + '/getDonutChartDataBySponsor';

        this.awardSummaryUrl = this.baseUrl + this.portAndPath + '/getAwardSummary';

        this.awardHierarchyUrl = this.baseUrl + this.portAndPath + '/getAwardHierarchy';

        this.awardTermsAndReportsUrl = this.baseUrl + this.portAndPath + '/getAwardReportsAndTerms';

        this.commitmentsUrl = this.baseUrl + this.portAndPath + '/getAwardCommitments';

        this.committeeCreateUrl = this.baseUrl + this.portAndPath + '/createCommittee';

        this.committeeSaveUrl = this.baseUrl + this.portAndPath + '/saveCommittee';

        this.committeeViewUrl = this.baseUrl + this.portAndPath + '/loadCommitteeById';

        this.researchAreaSaveUrl = this.baseUrl + this.portAndPath + '/saveAreaOfResearch';

        this.deleteResearchAreaUrl = this.baseUrl + this.portAndPath + '/deleteAreaOfResearch';

        this.addCommitteeMembership = this.baseUrl + this.portAndPath + '/addCommitteeMembership';

        this.saveCommitteeMembers = this.baseUrl + this.portAndPath + '/saveCommitteeMembers';

        this.generateScheduleUrl = this.baseUrl + this.portAndPath + '/addSchedule';

        this.updateSchedule = this.baseUrl + this.portAndPath + '/updateSchedule';

        this.deleteScheduleUrl = this.baseUrl + this.portAndPath + '/deleteSchedule';

        this.filterScheduleUrl = this.baseUrl + this.portAndPath + '/filterCommitteeScheduleDates';

        this.resetFilterScheduleUrl = this.baseUrl + this.portAndPath + '/resetCommitteeScheduleDates';

        this.updateScheduleUrl = this.baseUrl + this.portAndPath + '/updateCommitteeSchedule';

        this.deleteMemberRoles = this.baseUrl + this.portAndPath + '/deleteMemberRoles';

        this.deleteMemberExpertise = this.baseUrl + this.portAndPath + '/deleteMemberExpertise';

        this.deleteCommitteeMembers = this.baseUrl + this.portAndPath + '/deleteCommitteeMembers';

        this.saveCommitteeMembersRole = this.baseUrl + this.portAndPath + '/saveCommitteeMembersRole';

        this.saveCommitteeMembersExpertise = this.baseUrl + this.portAndPath + '/saveCommitteeMembersExpertise';

        this.updateMemberRoles = this.baseUrl + this.portAndPath + '/updateMemberRoles';

        this.loadScheduleData = this.baseUrl + this.portAndPath + '/loadScheduleById';

        this.addOtherActions = this.baseUrl + this.portAndPath + '/addOtherActions';

        this.deleteOtherActions = this.baseUrl + this.portAndPath + '/deleteOtherActions';

        this.addScheduleMinuteUrl = this.baseUrl + this.portAndPath + '/addCommitteeScheduleMinute';

        this.deleteScheduleMinuteUrl = this.baseUrl + this.portAndPath + '/deleteScheduleMinute';

        this.updateScheduleMinuteUrl = this.baseUrl + this.portAndPath + '/updateCommitteeScheduleMinute';

        this.addScheduleAttachment = this.baseUrl + this.portAndPath + '/addScheduleAttachment';

        this.deleteScheduleAttachment = this.baseUrl + this.portAndPath + '/deleteScheduleAttachment';

        this.downloadAttachments = this.baseUrl + this.portAndPath + '/downloadScheduleAttachment';

        this.updateScheduleAttachments = this.baseUrl + this.portAndPath + '/updateScheduleAttachment';

        this.addGuestMember = this.baseUrl + this.portAndPath + '/addOthersPresent';

        this.updateScheduleAttendanceData = this.baseUrl + this.portAndPath + '/updateScheduleAttendance';

        this.deleteGuestMenberScheduleAttendance = this.baseUrl + this.portAndPath + '/deleteScheduleAttendance';

        this.createGrantCalls = this.baseUrl + this.portAndPath + '/createGrantCall';

        this.saveOrUpdateGrantCall = this.baseUrl + this.portAndPath + '/saveOrUpdateGrantCall';

        this.fetchSponsorsBySponsorType = this.baseUrl + this.portAndPath + '/fetchSponsorsBySponsorType';

        this.loadGrantCallById = this.baseUrl + this.portAndPath + '/loadGrantCallById';

        this.deleteGrantCallKeyword = this.baseUrl + this.portAndPath + '/deleteGrantCallKeyword';

        this.deleteGrantCallContact = this.baseUrl + this.portAndPath + '/deleteGrantCallContact';

        this.deleteGrantCallAreaOfResearch = this.baseUrl + this.portAndPath + '/deleteGrantCallAreaOfResearch';

        this.deleteGrantCallEligibility = this.baseUrl + this.portAndPath + '/deleteGrantCallEligibility';

        this.addGrantCallAttachment = this.baseUrl + this.portAndPath + '/addGrantCallAttachment';

        this.saveUpdateGrantCall = this.baseUrl + this.portAndPath + '/saveUpdateGrantCall';

        this.deleteGrantCallAttachment = this.baseUrl + this.portAndPath + '/deleteGrantCallAttachment';

        this.downloadGrantCallAttachment = this.baseUrl + this.portAndPath + '/downloadGrantCallAttachment';

        this.publishGrantCall = this.baseUrl + this.portAndPath + '/publishGrantCall';

        this.createProposalUrl = this.baseUrl + this.portAndPath + '/createProposal';

        this.addProposalAttachment = this.baseUrl + this.portAndPath + '/addProposalAttachment';

        this.deleteProposalAttachment = this.baseUrl + this.portAndPath + '/deleteProposalAttachment';

        this.saveOrUpdateProposal = this.baseUrl + this.portAndPath + '/saveOrUpdateProposal';

        this.downloadProposalAttachment = this.baseUrl + this.portAndPath + '/downloadProposalAttachment';

        this.deleteProposalResearchArea = this.baseUrl + this.portAndPath + '/deleteProposalResearchArea';

        this.deleteIrbProtocol = this.baseUrl + this.portAndPath + '/deleteIrbProtocol';

        this.deleteProposalSponsor = this.baseUrl + this.portAndPath + '/deleteProposalSponsor';

        this.deleteProposalPersonUrl = this.baseUrl + this.portAndPath + '/deleteProposalPerson';

        this.deleteBudgetUrl = this.baseUrl + this.portAndPath + '/deleteProposalBudget';

        this.deleteProposalKeywordUrl = this.baseUrl + this.portAndPath + '/deleteProposalKeyword';

        this.fetchCostElementUrl = this.baseUrl + this.portAndPath + '/fetchCostElementByBudgetCategory';

        this.loadProposalById = this.baseUrl + this.portAndPath + '/loadProposalById';

        this.submitProposalUrl = this.baseUrl + this.portAndPath + '/submitProposal';

        this.approveRejectProposalUrl = this.baseUrl + this.portAndPath + '/approveOrRejectProposal';

        this.downloadRoutelogAttachmentUrl = this.baseUrl + this.portAndPath + '/downloadWorkflowAttachment';

        this.addReviewerUrl = this.baseUrl + this.portAndPath + '/assignReviewer';

        this.fetchReviewerUrl = this.baseUrl + this.portAndPath + '/fetchReviewers';

        this.completeReviewUrl = this.baseUrl + this.portAndPath + '/reviewCompleted';
        
        this.fetchOpenGrantIds = this.baseUrl + this.portAndPath + '/fetchReportData';

        this.applicationReport = this.baseUrl + this.portAndPath + '/applicationReport';

        this.removeAssignedReviewerUrl = this.baseUrl + this.portAndPath + '/deleteReviewer';

        this.submitEndorsementUrl = this.baseUrl + this.portAndPath + '/submitForEndorsement';

        this.approveByProvost = this.baseUrl + this.portAndPath + '/approveProvost';

        this.projectVariationRequestUrl = this.baseUrl + this.portAndPath + '/createProjectVariationRequest';

        this.viewTemplateUrl = this.baseUrl + this.portAndPath + '/viewTemplate';
        
        this.getContractAdminUrl = this.baseUrl + this.portAndPath + '/getContractAdmin';
        
        this.submitOSTDetailsUrl = this.baseUrl + this.portAndPath + '/submitOSTDetails';

        this.createProposalBudgetUrl = this.baseUrl + this.portAndPath + '/createProposalBudget';
        
        this.getBudgetRatesUrl = this.baseUrl + this.portAndPath + '/getBudgetRates';
        
        this.autoCalculateUrl = this.baseUrl + this.portAndPath + '/autoCalculate';
        
        this.resetBudgetRatesUrl = this.baseUrl + this.portAndPath + '/resetBudgetRates';
        
        this.getSyncBudgetRatesUrl = this.baseUrl + this.portAndPath + '/getSyncBudgetRates';
        
        this.deleteBudgetLineItemUrl = this.baseUrl + this.portAndPath + '/deleteBudgetLineItem';
        
        this.deleteBudgetPeriodUrl = this.baseUrl + this.portAndPath + '/deleteBudgetPeriod';
        
        this.printProposalUrl = this.baseUrl + this.portAndPath + '/printProposalPdfReport';

        //this.outputPath = 'http://192.168.1.242:8080/kc-dev';
        this.outputPath = 'http://demo.fibiweb.com/kc-dev';
        //this.outputPath = 'http://52.20.110.7:8080/kc-dev';
        //this.outputPath = 'http://14.140.179.70:1550/kc-dev';
        //this.outputPath = 'http://192.168.1.76:8080/kc-dev';
        
        this.outputPathAB = 'http://demo.fibiweb.com/AwardBudgetTool';
        //this.outputPathAB = 'http://14.140.179.70:1550/AwardBudgetTool';
        //this.outputPathAB = 'http://192.168.1.76:8080/AwardBudgetTool';

       // this.outputPathOST = 'http://192.168.1.76:8080/osr'
        //this.outputPathOST = 'http://192.168.1.104:8070/osr';
        //this.outputPathOST = 'http://14.140.179.70:1550/osr';
        this.outputPathOST = 'http://demo.fibiweb.com/osr';

        //this.IRBOutputPath = 'http://localhost:8080/mit-irb/dashboard#/irb/dashboard';
        //this.IRBOutputPath = 'http://192.168.1.76:8080/mit-irb/dashboard#/irb/dashboard';
        this.IRBOutputPath = 'http://demo.fibiweb.com/mit-irb/dashboard#/irb/dashboard';
        //this.IRBOutputPath = 'http://14.140.179.70:1550/mit-irb/dashboard#/irb/dashboard';
    }
}
