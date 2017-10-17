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
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header';
import { DashboardService } from './dashboard/dashboard.component.service';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.component.service';
import { ViewComponent } from './view.component';
import { GoogleChartComponent } from './research_summary/googlechartcomponent';
import { GooglePiChartComponent } from './research_summary/google.pichart.component';
import { GoogleChartService } from './research_summary/google-chart.service';
import { SessionmanagementService } from './session/session.management.service';
import { SessiontimeoutService } from './sessionTimeout/sessiontimeout.service';
import { AwardQuickSearchComponent } from './quick-search/award-quick-search.component';
import { DisclosureQuickSearchComponent } from './quick-search/disclosure-quick-search.component';
import { IacucQuickSearchComponent } from './quick-search/iacuc-quick-search.component';
import { IrbQuickSearchComponent } from './quick-search/irb-quick-search.component';
import { AwardelasticsearchService } from './elasticSearch/awardelasticsearch.service';
import { DisclosureelasticsearchService } from './elasticSearch/disclosureelasticsearch.service';
import { IacucelasticsearchService } from './elasticSearch/iacucelasticsearch.service';
import { IrbelasticsearchService } from './elasticSearch/irbelasticsearch.service';


let appRoutes = [
  { path: '', component: LoginComponent },

  { path: 'dashboard', component: AppComponent },
  
  { path : 'loginpage', component : LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    LoginComponent,
    HeaderComponent,
    ViewComponent,
    GoogleChartComponent,
    GooglePiChartComponent,
    AwardQuickSearchComponent,
    DisclosureQuickSearchComponent,
    IacucQuickSearchComponent,
    IrbQuickSearchComponent
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
  providers: [DashboardService, LoginService, GoogleChartService, SessionmanagementService, { provide: LocationStrategy, useClass: HashLocationStrategy },
              SessiontimeoutService, AwardelasticsearchService, DisclosureelasticsearchService, IacucelasticsearchService,
              IrbelasticsearchService ],
  bootstrap: [ViewComponent]
})
export class AppModule { }
