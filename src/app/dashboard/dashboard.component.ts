import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.component.service';
import { PagerService } from './dashboard.pager.service';
import { SlicePipe } from '@angular/common';
import { Router} from '@angular/router';
import { SessionmanagementService } from "../session/session.management.service";

@Component({
    selector: 'dashboard-tpl',
    templateUrl: 'dashboard.component.html',
    providers : [SessionmanagementService],
    styleUrls: ['../css/bootstrap.min.css', '../css/font-awesome.min.css', '../../assets/css/style.css']
})

export class DashboardComponent implements OnInit {

     currentPosition: string='SUMMARY';
     pageNumber:number;
     sortBy: string = 'updateTimeStamp';
     sortOrder: string = "DESC";
     result: any = {};
     serviceRequestList: any[];
     tableLength: number;
     pager: any = {};
     pagedItems: any[];
     
     propertyName: string;
     reverse: boolean = true;
    // outputPath:string = 'http://192.168.1.242:8080/kc-dev';
     outputPath:string = 'http://demo.fibiweb.com/kc-dev';
     userName :string;
     firstName: string;
     lastName: string;
     personID: string;
     
     selectedIndexInPagination: number = 0;
     currentRows: number;
     logo : string;
     footerLogo : string;
     dashBoardResearchSummaryMap : any[];
     fullName: string;
     pageNumbersList: any[];

    constructor( private dashboardService: DashboardService , private pagerService: PagerService, private router : Router, private sessionService : SessionmanagementService ) {
        this.logo = './assets/images/logo.png';
        this.footerLogo = './assets/images/footerLogo.png';
        if(!sessionService.canActivate()){
            this.router.navigate(['/loginpage']);
        }
        else{
            this.router.navigate(['/dashboard']);
        }

    }

    ngOnInit() {
        this.initialLoad();
        this.getResearchSummaryData();
        this.fullName = this.dashboardService.setLogindata();
        console.log(this.fullName);
    }
    showTab(currentTabPosition) {
         this.pageNumber = 30;
         this.propertyName = '';
         this.count = 1;
         this.currentPosition = currentTabPosition;
         this.pagedItems = null;
         this.sortBy = 'updateTimeStamp';
         this.initialLoad();
         this.selectedIndexInPagination = 0;
         this.showRecords(0);
         if(currentTabPosition ==='SUMMARY') {
             this.getResearchSummaryData();
         }
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
     
    currentNumberOfRecords: number;
    totalPage: number = 0;
    lastPage: number = 0;
    check: number = 0;
    isLastClicked: boolean = false;
    constant:number = 30;

    initialLoad() {
        console.log(this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition);
        this.dashboardService.loadDashBoard(this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition)
                             .subscribe(
                                 data =>
                                 {  
                                    this.result = data || [];
                                    this.serviceRequestList = this.result.dashBoardDetailMap;
                                    if(this.pageNumbersList != null){
                                        this.pageNumbersList = this.result.pageNumbers;
                                    } else {
                                        this.pageNumbersList = [];
                                    }
                                    this.currentNumberOfRecords = this.result.serviceRequestCount;
                                    this.firstName = this.result.personDTO.firstName;
                                    this.lastName = this.result.personDTO.lastName;
                                    this.personID = this.result.personDTO.personID;
                                    this.userName = localStorage.getItem('currentUser');
                                    this.fullName = localStorage.getItem('userFullname');

                                    if (this.pageNumber == 30) {
                                        this.totalPage = this.result.totalServiceRequest;
                                        this.lastPage = Math.floor(this.totalPage/10);
                                        if ((this.totalPage % 10) > 0) {
                                            this.lastPage = this.lastPage + 1;
                                        }
                                        if ((this.lastPage * 10) % 30 > 0 ) {
                                            this.check = (Math.floor((this.lastPage * 10) / 30)+1) * 30;
                                        } else {
                                            this.check = this.lastPage * 10;
                                        }
                                    }
                                    if (this.pageNumbersList != null) {
                                    if (this.isLastClicked) {
                                        if (this.pageNumbersList.length == 3) {
                                            this.selectedIndexInPagination = 2;
                                            this.showRecords(2);
                                        } else if (this.pageNumbersList.length == 2) {
                                            this.selectedIndexInPagination = 1;
                                            this.showRecords(1);
                                        }else if (this.pageNumbersList.length == 1) {
                                            this.selectedIndexInPagination = 0;
                                            this.showRecords(0);
                                        }
                                    }
                                    } else {
                                        if (this.serviceRequestList != null) {
                                            this.selectedIndexInPagination = 0;
                                            this.showRecords(0);
                                        }
                                    }
                                    this.isLastClicked = false;
                                });
    }
    
    count:number = 1;
    nextPage(selectedIndexInPagination) {
        if(selectedIndexInPagination == 0) {
            this.selectedIndexInPagination = 1;
            this.showRecords(1);
        } else if(selectedIndexInPagination == 1) {
            this.selectedIndexInPagination = 2;
            this.showRecords(2);
        } else if(selectedIndexInPagination == 2){
            if ( this.check >= 30 * (this.count+1)) {
                this.count = this.count + 1;
                this.pageNumber = 30 * this.count;
                this.initialLoad();
                this.selectedIndexInPagination = 0;
                this.showRecords(0);
            }
        }
    };
    prevPage(selectedIndexInPagination) {
        if(selectedIndexInPagination == 0) {
            if (this.pageNumber > 30){
                this.count = this.count-1;
                this.pageNumber = 30 * this.count;
                this.initialLoad();
            }
            this.selectedIndexInPagination = 2;
            this.showRecords(2);
        } else if (selectedIndexInPagination == 1) {
            this.selectedIndexInPagination = 0;
            this.showRecords(0);
        } else if (selectedIndexInPagination == 2) {
            this.selectedIndexInPagination = 1;
            this.showRecords(1);
        }
    };

    begin : number = 0;
    end  :number = 10;
    //this.selectedIndexInPagination = 0;
    pagekey = 0;
    showRecords(key) {
        this.selectedIndexInPagination = key;
        if (key == 0) {
            this.begin = 0;
            this.end = 10;
        }
        if (key == 1) {
            this.begin = 10;
            this.end = 2 * 10;
        }
        if (key == 2) {
            this.begin = 2 * 10;
            this.end = 3 * 10;
        }
        this.currentRows = this.end - this.begin;
        this.pagekey = key;
    };
    first() {
        this.pageNumber = 30;
        this.count = 1;
        this.initialLoad();
        this.selectedIndexInPagination = 0;
        this.showRecords(0);
    };
    last(list) {
        this.pageNumber = this.check;
        this.count = Math.floor(this.pageNumber/30);
        this.isLastClicked = true;
        this.initialLoad();    
    };
    setPage(page: number) {
        if (page % 4 === 0) {
            this.pageNumber = ((page/4)+1)*30;
            this.dashboardService.loadDashBoard(this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition)
            .subscribe(
                data =>
                {  
                   this.result = data || [];
                   //this.dashBoardDetailMap = this.result.dashBoardDetailMap;
                   //this.totalServiceRequestCount = this.result.totalServiceRequest;
                   //this.setPage(1);
               });
       }
        // this.pager = this.pagerService.getPager(this.totalServiceRequestCount, page);
        // if (page < 1 || page > this.pager.totalPages) {
        //     return;
        // }
        // this.pagedItems = this.dashBoardDetailMap.slice(this.pager.startIndex, this.pager.endIndex + 1);
        // this.tableLength = this.pagedItems.length;
    }
    getResearchSummaryData() {
        this.dashboardService.getResearchSummaryData()
        .subscribe(data =>
        {  
            this.result = data || [];
            this.dashBoardResearchSummaryMap=this.result.dashBoardResearchSummaryMap;
            console.log("getResearchSummaryData");
            console.log(this.result)
        });
    }
    logout(){
        this.dashboardService.logout()
        .subscribe(data => 
        {   if(data =='SUCCESS'){
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userFullname');
                this.router.navigate(['/loginpage']);
            }
            console.log('logout data : ' + data);
        });
    }
}
