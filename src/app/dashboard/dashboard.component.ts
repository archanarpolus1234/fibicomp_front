import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.component.service';
import { PagerService } from './dashboard.pager.service';

@Component({
    selector: 'dashboard-tpl',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['../css/style.css','../css/jquery-ui.css','../css/massautocomplete.theme.css'],
})

export class DashboardComponent implements OnInit {

     currentPosition: string='SUMMARY';
     pageNumber = 31;
     sortBy: string = 'updateTimeStamp';
     sortOrder: string = "DESC";
     result: any = {};
     dashBoardDetailMap: any[];
     tableLength: number;
     pager: any = {};
     pagedItems: any[];
     totalServiceRequestCount: number;
     propertyName: string;
     reverse: boolean = true;
     
    constructor( private dashboardService: DashboardService , private pagerService: PagerService ) {}

    ngOnInit() {
        this.showTab(this.currentPosition);
    }
    showTab(currentTabPosition) {
         this.currentPosition = currentTabPosition;
         this.pagedItems = null;
         this.sortBy = 'updateTimeStamp';
         this.sortResult(this.sortBy,this.currentPosition);
    }
         
    sortResult(sortFieldBy, current_Position) {
        this.reverse = (this.sortBy === sortFieldBy) ? !this.reverse : false;
        if(this.reverse){
            this.sortOrder = "DESC";
        } else {
            this.sortOrder = "ASC";
        }
        this.sortBy = sortFieldBy;
        this.currentPosition = current_Position;
        this.initialLoad();
     }
     
    initialLoad() {
        this.dashboardService.loadDashBoard(this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition)
                             .subscribe(
                                 data =>
                                 {  
                                    this.result = data || [];
                                    this.dashBoardDetailMap = this.result.dashBoardDetailMap;
                                    console.log("TotalServiceRequest");
                                    console.log(this.result.totalServiceRequest);
                                    this.totalServiceRequestCount = this.result.totalServiceRequest;
                                    this.setPage(1);
                                });
    }
    setPage(page: number) {
        this.pager = this.pagerService.getPager(this.totalServiceRequestCount, page);
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pagedItems = this.dashBoardDetailMap.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.tableLength = this.pagedItems.length;
    }
}
