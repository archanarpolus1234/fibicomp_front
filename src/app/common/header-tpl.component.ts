import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {LoginCheckService} from '../common/login-check.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Constants } from '../constants/constants.service';
import { DashboardConfigurationService } from './dashboard-configuration-service';
import {DashboardComponent} from '../dashboard/dashboard.component';

@Component({
    selector:'header-tpl',
    templateUrl:'header-tpl.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
})

export class HeaderComponent implements OnInit{
    morethanThreeNotification: boolean;
    docId: string;
    notificationList: any[];
    result: any = {};
    personId: string;
    first3notificationList: any[] = [];
    showmoreNeeded: boolean = true;
    showmoreClicked: boolean = false;
    toggleBox: boolean = false;
    fullName: string;
    userName: string;
    adminStatus: string;
    isLoggedIn$ : Observable <Boolean>;
    isAdmin: boolean = false;
    outputPath: string;
    logo: string;
    showConfiguringOption: boolean = false;

    expenditureVolumWidget : boolean = true; 
    researchSummaryWidget : boolean = true; 
    awardedProposalBySponsorWidget : boolean = true; 
    awardBysponsorTypesWidget : boolean = true;
    proposalBySponsorTypesWidget: boolean = true;
    inProgressproposalBySponsorWidget : boolean = true;
    message : string;

    @ViewChild('notificationBar') notificationBar: ElementRef;
    @ViewChild('configurationBar') configurationBar: ElementRef;
    
    constructor(private loginCheckService: LoginCheckService, private dashboardService: DashboardService, private router: Router, private constant: Constants, private dashboardConfigurationService: DashboardConfigurationService) {
        document.addEventListener( 'mouseup', this.offClickHandler.bind(this));
        document.addEventListener( 'mouseup', this.offClickHandlerDashboardConf.bind(this));
        this.outputPath = this.constant.outputPath;
        this.logo = './assets/images/logo.png';
    }
    
    offClickHandler(event: any) { 
        if (!this.notificationBar.nativeElement.contains(event.target) ) {
            this.toggleBox = false;
        }
    }
    
    offClickHandlerDashboardConf(event: any) {
        if (!this.configurationBar.nativeElement.contains(event.target) ) {
            this.showConfiguringOption = false;
        }
    }
    
    ngOnInit(): void {
       this.isLoggedIn$ = this.loginCheckService.isLoggedIn;
       this.adminStatus = localStorage.getItem('isAdmin');
       this.userName = localStorage.getItem('currentUser');
       this.fullName = localStorage.getItem('userFullname');
       if (this.adminStatus == 'true') {
           this.isAdmin = true;
       }  
       this.dashboardConfigurationService.currentdashboardExpenditureVolumeWidget.subscribe(status=>{
           this.expenditureVolumWidget = status;
       });
       this.dashboardConfigurationService.currentdashboardResearchSummaryWidget.subscribe(status=>{
           this.researchSummaryWidget = status;
       });
       this.dashboardConfigurationService.currentdashboardawardedProposalBySponsorWidget.subscribe(status=>{
           this.awardedProposalBySponsorWidget = status;
       });
       this.dashboardConfigurationService.currentdashboardAwardBysponsorTypesWidget.subscribe(status=>{
           this.awardBysponsorTypesWidget = status;
       });
       this.dashboardConfigurationService.currentdashboardproposalBySponsorTypesWidget.subscribe(status=>{
           this.proposalBySponsorTypesWidget = status;
       });
       this.dashboardConfigurationService.currentdashboardinProgressproposalBySponsorWidget.subscribe(status=>{
           this.inProgressproposalBySponsorWidget = status;
       });
    }
	
    logout() {
        this.dashboardService.logout().subscribe( 
            data => {
                if(data != null){ 
                    if (data == 'SUCCESS') {
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('personId');
                        localStorage.removeItem('userFullname');
                        localStorage.removeItem('isAdmin');
                        this.loginCheckService.logout();
                        this.router.navigate( ['/loginpage'] );
                    }
                }
            } );
    }
    
    userNotification(event: any) {  debugger;
        event.preventDefault();
        this.toggleBox = !this.toggleBox;   debugger;
        this.showmoreClicked = false;
        this.showmoreNeeded = true;
        this.first3notificationList = [];
        this.personId = localStorage.getItem('personId');
        if (this.toggleBox == true) {
            this.dashboardService.userNotification(this.personId)
                .subscribe( data => {
                    this.result = data || [];
                    if(this.result != null){
                        this.notificationList = this.result;
                        this.docId = this.result.documentId;
                        if (this.notificationList.length > 3) {
                            this.morethanThreeNotification = true;
                            for (let i = 0; i < 3; i++) {
                                this.first3notificationList.push(this.notificationList[i]);
                            }
                        }
                    }
                } );
        }
    }

    showMore(event: any) {
        this.showmoreClicked = true;
        event.preventDefault();
        this.showmoreNeeded = false;
    }

    myDashboard( event: any ) {
        event.preventDefault();
        this.router.navigate( ['/dashboard'] );
    }
    
    configureDashboard(event : any) {
        event.preventDefault();
        this.showConfiguringOption = !this.showConfiguringOption;
    }
    
    public onChangeOfexpenditureVolumWidget(value:boolean){
        localStorage.setItem('dashboardExpenditureVolumeWidget', String(value));
        this.dashboardConfigurationService.changeDashboardExpenditureVolumeWidget(value);
    }
    public onChangeOfresearchSummaryWidget(value:boolean){
        localStorage.setItem('dashboardResearchSummaryWidget', String(value));
        this.dashboardConfigurationService.changeDashboardResearchSummaryWidgett(value);
    }
    public onChangeOfawardedProposalBySponsorWidget(value:boolean){
        localStorage.setItem('dashboardawardedProposalBySponsorWidget', String(value));
        this.dashboardConfigurationService.changeDashboardawardedProposalBySponsorWidget(value);
    }
    public onChangeOfawardBysponsorTypesWidget(value:boolean){
        localStorage.setItem('dashboardAwardBysponsorTypesWidget', String(value));
        this.dashboardConfigurationService.changeDashboardAwardBysponsorTypesWidget(value);
    }
    public onChangeOfinProgressproposalBySponsorWidget(value:boolean){
        localStorage.setItem('dashboardinProgressproposalBySponsorWidget', String(value));
        this.dashboardConfigurationService.changeDashboardinProgressproposalBySponsorWidget(value);
    }
    public onChangeOfproposalBySponsorTypesWidget(value:boolean){
        localStorage.setItem('dashboardproposalBySponsorTypesWidget', String(value));
        this.dashboardConfigurationService.changeDashboardproposalBySponsorTypesWidget(value);
    }
}
