import {Component} from '@angular/core';

@Component({
    selector:'award-reports-and-terms',
    templateUrl:'award-reports-and-terms.component.html',
    styleUrls:['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
})

export class AwardReportsAndTerms {
    showReports : boolean = false;
    showPaymentAndInvoice : boolean = false;
    showApprovedSpecialItems : boolean = true;
    showTerms : boolean = false;

	constructor() {
		
	}
	
	showReportingTab(event:any){
	    event.preventDefault();
	    this.showReports = !this.showReports;
	}
	
	showPaymentAndInvoiceTab(event:any){
        event.preventDefault();
        this.showPaymentAndInvoice = !this.showPaymentAndInvoice;
    }
	
	showApprovedSpecialItemsTab(event:any){
        event.preventDefault();
        this.showApprovedSpecialItems = !this.showApprovedSpecialItems;
    }
	
	showTermsTab(event:any){
        event.preventDefault();
        this.showTerms = !this.showTerms;
    }
}