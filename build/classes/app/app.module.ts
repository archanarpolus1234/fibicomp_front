import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule,Routes} from '@angular/router';
import { HttpModule } from '@angular/http';
//import { HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header';
import { AwardComponent } from './award';
import { DashboardService } from './dashboard.service';
import { LoginComponent } from './login.component';
import { LoginService } from './login.component.service';
import { ViewComponent } from './view.component';


var appRoutes = [
  { path: '', component: LoginComponent },
  
  {path: 'dashboard', component: AppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    AwardComponent,
    LoginComponent,
    HeaderComponent,
    ViewComponent
   // HttpClient
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes) 
    // RouterModule.forRoot([
    //   {
    //     path: 'award',
    //     component: AwardComponent
    //   },

      // {
      //   path: '',
      //   redirectTo: '/dashboard',
      //   pathMatch: 'full'
      // }
    //])
  ],
  providers: [DashboardService,LoginService],
  bootstrap: [ViewComponent]
})
export class AppModule { }
