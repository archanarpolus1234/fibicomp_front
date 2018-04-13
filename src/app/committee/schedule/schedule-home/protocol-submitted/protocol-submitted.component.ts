import { Component, OnInit } from '@angular/core';
import { ScheduleConfigurationService } from "../../schedule-configuration.service";
import { Constants } from "../../../../constants/constants.service";
import { Subscription } from "rxjs/Subscription";

@Component( {
    selector: 'app-protocol-submitted',
    templateUrl: './protocol-submitted.component.html',
    styleUrls: ['../../../../../assets/css/bootstrap.min.css', '../../../../../assets/css/font-awesome.min.css', '../../../../../assets/css/style.css', '../../../../../assets/css/search.css']
} )
export class ProtocolSubmittedComponent implements OnInit {
    public result: any = {};
    outputPath: string;
    userName: string;
    public subscription : Subscription;
    constructor( private scheduleConf: ScheduleConfigurationService, private consts: Constants ) { }

    ngOnInit() {
       this.subscription = this.scheduleConf.currentScheduleData.subscribe( data => {
            this.result = data;
            this.outputPath = this.consts.outputPath;
            this.userName = localStorage.getItem( 'currentUser' );
        } );

    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
