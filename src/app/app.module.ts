import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
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
import { DashboardService } from './dashboard/dashboard.component.service';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.component.service';
import { ViewComponent } from './view.component';
import { GoogleAreachartComponent } from './research_summary/googleareachart.component';
import { GooglePiChartComponent } from './research_summary/google.pichart.component';
import { GoogleChartService } from './research_summary/google.chart.service';
import { SessionmanagementService } from './session/session.management.service';
import { AwardElasticSearchComponent } from './elasticSearch/award.elasticsearch.component';
import { DisclosureElasticSearchComponent } from './elasticSearch/disclosure.elasticsearch.component';
import { IacucElasticSearchComponent } from './elasticSearch/iacuc.elasticsearch.component';
import { IrbElasticSearchComponent } from './elasticSearch/irb.elasticsearch.component';
import { AwardElasticsearchService } from './elasticSearch/award.elasticsearch.service';
import { DisclosureElasticsearchService } from './elasticSearch/disclosure.elasticsearch.service';
import { IacucElasticsearchService } from './elasticSearch/iacuc.elasticsearch.service';
import { IrbElasticsearchService } from './elasticSearch/irb.elasticsearch.service';
import { ProposalElasticSearchComponent } from "./elasticSearch/proposal.elasticsearch.component";
import { ProposalElasticsearchService } from "./elasticSearch/proposal.elasticsearch.service";
import { WarningModalComponent } from './session/warningModal.component';
import { TimeoutModalComponent } from './session/timeoutmodal.component';
import { SessiontimeoutComponent } from './session/sessiontimeout.component';

let appRoutes = [
  { path: '', component: LoginComponent },

  { path: 'dashboard', component: AppComponent },
  
  { path : 'loginpage', component : LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ViewComponent,
    GoogleAreachartComponent,
    GooglePiChartComponent,
    AwardElasticSearchComponent,
    DisclosureElasticSearchComponent,
    IacucElasticSearchComponent,
    IrbElasticSearchComponent,
    ProposalElasticSearchComponent,
    WarningModalComponent,
    TimeoutModalComponent,
    SessiontimeoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    NgIdleKeepaliveModule.forRoot(),
    NgbModule.forRoot(),
    Ng2PageScrollModule
  ],
  providers: [DashboardService, LoginService, GoogleChartService, SessionmanagementService,
              { provide: LocationStrategy, useClass: HashLocationStrategy },
               AwardElasticsearchService, DisclosureElasticsearchService, IacucElasticsearchService,
              IrbElasticsearchService, ProposalElasticsearchService ],
  bootstrap: [ViewComponent]
})
export class AppModule { }
