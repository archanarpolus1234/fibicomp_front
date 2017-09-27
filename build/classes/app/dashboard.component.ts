import { Component,OnInit } from '@angular/core';
//import { Data } from './data';
//import { DATAS } from './mockdata';
 import { DashboardService } from './dashboard.service';

@Component({
    selector: 'dashboard-tpl',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['css/style.css','css/jquery-ui.css','css/massautocomplete.theme.css'],
})

export class DashboardComponent implements OnInit {
     text: String;
  //  data;
    constructor( private dashboardService: DashboardService ){}
     ngOnInit(){
         console.log("test1");
        this.dashboardService.loadDashBoard()
                             .subscribe(data => this.text=JSON.stringify(data),
                                        error => alert(error),
                                        ()=>console.log("finished"));
        
        // this.data = this.dashboardService.search();
        // console.log(this.data);
     }
    // showTab() {
    //     this.text = 'AWARD';
    //  }
}