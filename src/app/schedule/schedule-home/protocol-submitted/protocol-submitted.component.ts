import { Component, OnInit } from '@angular/core';
import { ScheduleConfigurationService } from "../../../common/schedule-configuration.service";
import { Constants } from "../../../constants/constants.service";

@Component( {
    selector: 'app-protocol-submitted',
    templateUrl: './protocol-submitted.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css', '../../../../assets/css/font-awesome.min.css', '../../../../assets/css/style.css', '../../../../assets/css/search.css']
} )
export class ProtocolSubmittedComponent implements OnInit {
    public result: any = {};
    outputPath: string;
    userName: string;
    constructor( private scheduleConf: ScheduleConfigurationService, private consts: Constants ) { }

    ngOnInit() {
        this.scheduleConf.currentScheduleData.subscribe( data => {
            this.result = data;
            console.log('protocol submitted: ', this.result.committeeSchedule.protocolSubmissions)
            this.outputPath = this.consts.outputPath;
            this.userName = localStorage.getItem( 'currentUser' );
        } );

    }
}
