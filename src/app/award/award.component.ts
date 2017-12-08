import { Component } from '@angular/core';

@Component( {
    templateUrl: 'award.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
} )

export class AwardComponent {
    currentTab: string = 'award_home';
    constructor() {

    }
    show_award_home( e: any, current_tab ) {
        e.preventDefault();
        console.log( "award_home_page" + current_tab );
        this.currentTab = current_tab;
    }
    
    show_award_reports_and_tabs(e: any, current_tab){
        e.preventDefault();
        console.log( "award_reports and terms" + current_tab );
        this.currentTab = current_tab;
        
    }
    
    show_award_hierarchy(e: any, current_tab){
        e.preventDefault();
        console.log( "award_hierarchy" + current_tab );
        this.currentTab = current_tab;
        
    }

}