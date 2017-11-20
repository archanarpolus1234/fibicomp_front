import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {LoginCheckService} from '../common/login-check.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Constants } from '../constants/constants.service';

@Component({
    selector:'header-tpl',
    templateUrl:'header-tpl.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
})

export class HeaderComponent implements OnInit{
    morethanThreeNotification: boolean;
    docId: string;
    notificationList: any[];
    result: any = {};
    personId: string;
    first3notificationList: any[] = [];
    showmoreNeeded: boolean = true;
    showmoreClicked: boolean = false;
    toggleBox: boolean = false;
    fullName: string;
    userName: string;
    adminStatus: string;
    isLoggedIn$ : Observable <Boolean>;
    isAdmin: boolean = false;
    outputPath: string;
    logo: string;
    
    @ViewChild('notificationBar') notificationBar: ElementRef;
    constructor(private loginCheckService: LoginCheckService, private dashboardService: DashboardService, private router: Router, private constant: Constants) {
        document.addEventListener( 'mouseup', this.offClickHandler.bind(this) );
        this.outputPath = this.constant.outputPath;
        this.logo = './assets/images/logo.png';
    }
    
    offClickHandler(event: any) {
        if (!this.notificationBar.nativeElement.contains(event.target) ) {
            this.toggleBox = false;
        }
    }
    
    ngOnInit(): void {
       this.isLoggedIn$ = this.loginCheckService.isLoggedIn;
       this.adminStatus = localStorage.getItem('isAdmin');
       this.userName = localStorage.getItem('currentUser');
       this.fullName = localStorage.getItem('userFullname');
       if (this.adminStatus == 'true') {
           this.isAdmin = true;
       }
    }
	
    logout() {
        this.dashboardService.logout().subscribe( 
            data => {
                if(data != null){ 
                    if (data == 'SUCCESS') {
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('personId');
                        localStorage.removeItem('userFullname');
                        localStorage.removeItem('isAdmin');
                        this.loginCheckService.logout();
                        this.router.navigate( ['/loginpage'] );
                    }
                }
            } );
    }
    
    userNotification(event: any) {
        event.preventDefault();
        this.toggleBox = !this.toggleBox;
        this.showmoreClicked = false;
        this.showmoreNeeded = true;
        this.first3notificationList = [];
        this.personId = localStorage.getItem('personId');
        if (this.toggleBox == true) {
            this.dashboardService.userNotification(this.personId)
                .subscribe( data => {
                    this.result = data || [];
                    if(this.result != null){
                        this.notificationList = this.result;
                        this.docId = this.result.documentId;
                        if (this.notificationList.length > 3) {
                            this.morethanThreeNotification = true;
                            for (let i = 0; i < 3; i++) {
                                this.first3notificationList.push(this.notificationList[i]);
                            }
                        }
                    }
                } );
        }
    }

    showMore(event: any) {
        this.showmoreClicked = true;
        event.preventDefault();
        this.showmoreNeeded = false;
    }

    myDashboard( event: any ) {
        event.preventDefault();
        this.router.navigate( ['/dashboard'] );
    }
}
