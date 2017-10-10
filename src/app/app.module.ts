import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header';
import { DashboardService } from './dashboard/dashboard.component.service';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.component.service';
import { ViewComponent } from './view.component';
import { PagerService } from './dashboard/dashboard.pager.service';
import {GoogleChartComponent} from './research_summary/googlechartcomponent';
import {GoogleChartService} from './research_summary/google-chart.service';
import { ChartsModule } from 'ng2-charts';
import { SessionmanagementService } from './session/session.management.service';

let appRoutes = [
  { path: '', component: LoginComponent },

  {path: 'dashboard', component: AppComponent},
  
  {path : 'loginpage', component : LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    LoginComponent,
    HeaderComponent,
    ViewComponent,
    GoogleChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [DashboardService, LoginService, PagerService, GoogleChartService, SessionmanagementService],
  bootstrap: [ViewComponent]
})
export class AppModule { }
