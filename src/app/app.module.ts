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

let appRoutes = [
  { path: '', component: LoginComponent },

  {path: 'dashboard', component: AppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    LoginComponent,
    HeaderComponent,
    ViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [DashboardService, LoginService, PagerService],
  bootstrap: [ViewComponent]
})
export class AppModule { }
