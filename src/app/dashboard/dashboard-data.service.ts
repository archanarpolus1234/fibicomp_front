import { Injectable } from '@angular/core';

@Injectable()
export class DashboardData {
    dashboardPieChartData: any = {};
    dashboardAreaChartData: any[];

	constructor() {}
	
	getDashboardPieChartData() : any {
	    return this.dashboardPieChartData;
	}
	
	setDashboardPieChartData(dashboardPieChartData : any) {
	    this.dashboardPieChartData = dashboardPieChartData;
	}
	
	getdashboardAreaChartData() : any[] {
	        return this.dashboardAreaChartData;
	}
	
	setdashboardAreaChartData(dashboardAreaChartData: any[]) {
	    this.dashboardAreaChartData = dashboardAreaChartData;
	}
}
