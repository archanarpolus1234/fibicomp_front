import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {LoginCheckService} from '../common/login-check.service';

@Component({
    selector: 'footer-tpl',
    templateUrl: 'footer-tpl.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
})

export class FooterComponent  implements OnInit{
    footerLogo: string;
    isLoggedIn$ : Observable <Boolean>;
    polusWebsite: string = 'http://polussolutions.com/';

    constructor(private loginCheckService: LoginCheckService) {
        this.footerLogo = './assets/images/footerLogo.png';
    }

    ngOnInit(): void {
       this.isLoggedIn$ = this.loginCheckService.isLoggedIn;
    }
}
