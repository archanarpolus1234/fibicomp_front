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

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { GoogleAreachartComponent } from './research_summary/google-area-chart.component';
import { GooglePiChartComponent } from './research_summary/google-piechart.component';
import { WarningModalComponent } from './session/warning-modal.component';
import { TimeoutModalComponent } from './session/timeout-modal.component';
import { SessionTimeoutComponent } from './session/session-timeout.component';
import { ExpandedviewComponent } from './research_summary/expanded-view.component';
import { ElasticSearchComponent } from './elasticSearch/elastic-search.component';
import { FooterComponent } from './common/footer-tpl.component';
import { HeaderComponent } from './common/header-tpl.component';

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

let appRoutes = [
    { path: '', component: LoginComponent },

    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

    { path: 'loginpage', component: LoginComponent },

    { path: 'expandedview', component: ExpandedviewComponent, canActivate: [AuthGuard]}
];

@NgModule( {
    declarations: [
        AppComponent,
        DashboardComponent,
        LoginComponent,
        GoogleAreachartComponent,
        GooglePiChartComponent,
        WarningModalComponent,
        TimeoutModalComponent,
        SessionTimeoutComponent,
        ExpandedviewComponent,
        ElasticSearchComponent,
        FooterComponent,
        HeaderComponent
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
        Ng2PageScrollModule
    ],
    providers: [DashboardService, LoginService, GoogleChartService, SessionManagementService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AwardElasticsearchService, DisclosureElasticsearchService, IacucElasticsearchService,
        IrbElasticsearchService, ProposalElasticsearchService, Constants, ExpandedViewDataService, ExpandedviewService, LoginCheckService, AuthGuard],
    bootstrap: [AppComponent]
} )

export class AppModule { }
