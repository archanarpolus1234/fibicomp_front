import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Idle } from '@ng-idle/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { TreeModule } from 'angular-tree-component';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ExpenditureVolumeChartComponent } from './research_summary/expenditure-volume-chart.component';
import { ProposalBySponsorPieChartComponent } from './research_summary/proposal-by-sponsor-piechart.component';
import { AwardedProposalDonutChartComponent } from './research_summary/awarded-proposal-donut-chart.component';
import { WarningModalComponent } from './session/warning-modal.component';
import { TimeoutModalComponent } from './session/timeout-modal.component';
import { SessionTimeoutComponent } from './session/session-timeout.component';
import { ExpandedviewComponent } from './research_summary/expanded-view.component';
import { ElasticSearchComponent } from './elasticSearch/elastic-search.component';
import { FooterComponent } from './common/footer-tpl.component';
import { HeaderComponent } from './common/header-tpl.component';
import { LogoutComponent } from './login/logout.component';
import { AwardBySponsorPieChartComponent } from './research_summary/award-by-sponsor-piechart.component';
import { InProgressProposalDonutChartComponent } from './research_summary/in-progress-proposal-donut-chart.component';
import { AwardComponent } from './award/award.component';
import { AwardHomeComponent } from './award/award-home/award-home.component';
import { AwardHierarchyComponent } from './award/award-hierarchy/award-hierarchy.component';
import { AwardReportsAndTerms } from './award/award-reports-and-tabs/award-reports-and-terms.component';
import { AwardCommitmentsComponent } from './award/award-commitments/award-commitments.component';

import { LoginService } from './login/login.service';
import { GoogleChartService } from './research_summary/google-chart.service';
import { SessionManagementService } from './session/session-management.service';
import { DashboardService } from './dashboard/dashboard.service';
import { AwardElasticsearchService } from './elasticSearch/award-elastic-search.service';
import { DisclosureElasticsearchService } from './elasticSearch/disclosure-elastic-search.service';
import { IacucElasticsearchService } from './elasticSearch/iacuc-elastic-search.service';
import { IrbElasticsearchService } from './elasticSearch/irb-elastic-search.service';
import { ProposalElasticsearchService } from './elasticSearch/proposal-elastic-search.service';
import { Constants } from './constants/constants.service';
import { ExpandedViewDataService } from './research_summary/expanded-view-data-service';
import { ExpandedviewService } from './research_summary/expanded-view.service';
import { LoginCheckService } from './common/login-check.service';
import { AuthGuard } from './common/auth-guard.service';
import { DashboardConfigurationService } from './common/dashboard-configuration-service';
import { AwardSummaryService } from './award/award-home/award-summary.service';
import { AwardHierarchyService } from './award/award-hierarchy/award-hierarchy.service';
import { AwardReportsAndTermsService } from './award/award-reports-and-tabs/award-reports-and-terms.service';
import { AwardCommitmentsService } from './award/award-commitments/award-commitments.service';

let appRoutes = [
    { path: '', component: LoginComponent },

    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

    { path: 'loginpage', component: LoginComponent },

    { path: 'logout', component: LogoutComponent },

    { path: 'award', component: AwardComponent },

    { path: 'expandedview', component: ExpandedviewComponent, canActivate: [AuthGuard] }
];

@NgModule( {
    declarations: [
        AppComponent,
        DashboardComponent,
        LoginComponent,
        ExpenditureVolumeChartComponent,
        ProposalBySponsorPieChartComponent,
        AwardedProposalDonutChartComponent,
        WarningModalComponent,
        TimeoutModalComponent,
        SessionTimeoutComponent,
        ExpandedviewComponent,
        ElasticSearchComponent,
        FooterComponent,
        HeaderComponent,
        AwardBySponsorPieChartComponent,
        InProgressProposalDonutChartComponent,
        LogoutComponent,
        AwardComponent,
        AwardReportsAndTerms,
        AwardHomeComponent,
        AwardHierarchyComponent,
        AwardCommitmentsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ChartsModule,
        ReactiveFormsModule,
        RouterModule.forRoot( appRoutes ),
        NgIdleKeepaliveModule.forRoot(),
        NgbModule.forRoot(),
        Ng2PageScrollModule,
        TreeModule
    ],
    providers: [DashboardService, LoginService, GoogleChartService, SessionManagementService, AwardSummaryService, AwardHierarchyService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AwardElasticsearchService, DisclosureElasticsearchService, IacucElasticsearchService,
        IrbElasticsearchService, ProposalElasticsearchService, Constants, ExpandedViewDataService, ExpandedviewService, LoginCheckService, AuthGuard, DashboardConfigurationService, AwardReportsAndTermsService,
        AwardCommitmentsService],
    bootstrap: [AppComponent]
} )

export class AppModule { }