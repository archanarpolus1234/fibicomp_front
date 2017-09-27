import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['css/style.css','css/jquery-ui.css','css/massautocomplete.theme.css'],

})
export class AppComponent {
}














// angular
// .module('app.dashboard', ['ui.router','ngCookies', 'dashboardServiceModule'])
// .config(function config($stateProvider) {
//     $stateProvider.state('/dashboard', {
//         url : '/dashboard',
//         views : {
//             "headerdata" : {
//                 template : '<header-data></header-data>'
//             },
//             "contentdata" : {
//                 template : '<dashboard-page></dashboard-page>'
//             },
//             "footerdata" : {
//                 template : '<footer-data></footer-data>'
//             }
//         }
//     });
// })
// .directive('dashboardPage', Dashboard)
// .filter('slice', function() {
//     return function(arr, start, end) {
//         var array = null;
//         if (angular.isDefined(arr) && null !=  arr) {
//         array = arr.slice(start, end);
//         }
//         return array;
//     };
// });
// function Dashboard () {
// var directive = {
// link: link,
// templateUrl: 'app_modules/dashboard/dashboard.tpl.jsp',
// restrict: 'E',
// controller: DashboardController,
// controllerAs: 'vm',
// bindToController: true
// }
// return directive;
// function link(scope, el, attr, ctrl) {
// console.log('dashboard directive loaded');
// }
// }
// DashboardController.$inject = ['dashboardService', '$http'];
// function DashboardController (dashboardService, $http) {
// var vm = this;
// vm.title = 'Fibi | Dashboard';
// vm.currentPosition = 'SUMMARY';




// vm.showTab = function(currentTabPosition) {
// vm.pageNumber = angular.copy(TOTAL_NO_OF_RECORDS);
// vm.propertyName = '';
// vm.count = 1;
// switch(currentTabPosition) {        	
//     case 'SUMMARY':
//         vm.currentPosition = 'SUMMARY';  
//         vm.text = "";
//         break;
//     case 'AWARD':
//         vm.currentPosition = 'AWARD';
//         vm.text = "All active awards";
//         break;
//     case 'PROPOSAL':
//         vm.currentPosition = 'PROPOSAL';
//         vm.text = "All proposals";                
//         break;
//     case 'IRB':  
//       vm.currentPosition = 'IRB';
//         vm.text = "All IRB protocols";
//       break;
//     case 'IACUC':
//       vm.currentPosition = 'IACUC';
//         vm.text = "All IACUC protocols";
//       break;
//     case 'DISCLOSURE':
//       vm.currentPosition = 'DISCLOSURE';
//         vm.text = "All disclosures";
//       break;
// }
// initialLoad();
// vm.selectedIndexInPagination = 0;
// vm.showRecords(0);   
// }
// vm.constant =  angular.copy(TOTAL_NO_OF_RECORDS);
// vm.pageNumber = angular.copy(TOTAL_NO_OF_RECORDS);
// vm.recordOutOfConstant = angular.copy(TOTAL_NO_OF_RECORDS);
// vm.currentNumberOfRecords = 0;
// vm.totalPage = 0;
// vm.pageNumbersList = [];
// vm.lastPage = 0;
// vm.check = 0;
// vm.isLastClicked = false;
// vm.order = '';
// function initialLoad () {
// dashboardService.loadDashBoard(vm.currentPosition, vm.pageNumber, vm.propertyName, vm.order
//     ).success(function(result){
//     console.log(result);
//                 vm.pageNumbersList = result.pageNumbers;
//     vm.currentNumberOfRecords = result.serviceRequestCount;
//     vm.adminUser = result.isUserCa;
//     vm.showAllReqTab = result.showAllReqTab;
//     /*vm.userRoleType = result.personDTO.userRoleType;
//     vm.loggedInUser = result.personDTO.fullName;*/
//     vm.firstName = result.personDTO.firstName;
//     vm.lastName = result.personDTO.lastName;					
//                 vm.loggedInUsername = result.personDTO.userName;
//                 vm.serviceRequestList = result.dashBoardDetailMap;
//                 vm.personId = result.personDTO.personID;
//                 if (vm.pageNumber == angular.copy(TOTAL_NO_OF_RECORDS)) {
//       vm.totalPage = result.totalServiceRequest;
//       vm.lastPage = Math.floor(vm.totalPage/angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS));
//       if (vm.totalPage%angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS) > 0) {
//         vm.lastPage = vm.lastPage + 1;
//       }
//       if ((vm.lastPage*angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS))%angular.copy(TOTAL_NO_OF_RECORDS) > 0 ) {
//         vm.check = (Math.floor((vm.lastPage*angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS))/angular.copy(TOTAL_NO_OF_RECORDS))+1)*angular.copy(TOTAL_NO_OF_RECORDS);
//       } else {
//         vm.check = vm.lastPage*angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS);
//       }
//     }
//                 if (vm.pageNumbersList != null) {
//     if (vm.isLastClicked) {
//       if (vm.pageNumbersList.length == 3) {
//         vm.selectedIndexInPagination = 2;
//         vm.showRecords(2);
//       } else if (vm.pageNumbersList.length == 2) {
//         vm.selectedIndexInPagination = 1;
//         vm.showRecords(1);
//       }else if (vm.pageNumbersList.length == 1) {
//         vm.selectedIndexInPagination = 0;
//         vm.showRecords(0);
//       }
//     }
//     } else {
//       if (vm.serviceRequestList != null) {
//         vm.selectedIndexInPagination = 0;
//         vm.showRecords(0);
//       }
//     }
//     vm.isLastClicked = false;
//   });
// };
// //initialLoad();
// vm.isCallStatusComplete = function() {
// return $http.pendingRequests.length == 0;
// };
// vm.count = 1;
// vm.nextPage = function(selectedIndexInPagination) {
// if(selectedIndexInPagination == 0) {
// vm.selectedIndexInPagination = 1;
// vm.showRecords(1);
// } else if(selectedIndexInPagination == 1) {
// vm.selectedIndexInPagination = 2;
// vm.showRecords(2);
// } else if(selectedIndexInPagination == 2){
// if ( vm.check >= angular.copy(TOTAL_NO_OF_RECORDS) * (vm.count+1)) {
//     vm.count = vm.count + 1;
//     vm.pageNumber = angular.copy(TOTAL_NO_OF_RECORDS) * vm.count;
//     initialLoad();
//     vm.selectedIndexInPagination = 0;
//     vm.showRecords(0);
// }
// }
// };
// vm.prevPage = function(selectedIndexInPagination) {
// if(selectedIndexInPagination == 0) {
// if (vm.pageNumber > angular.copy(TOTAL_NO_OF_RECORDS)){
//     vm.count = vm.count-1;
//     vm.pageNumber = angular.copy(TOTAL_NO_OF_RECORDS) * vm.count;
//     initialLoad();
// }
// vm.selectedIndexInPagination = 2;
// vm.showRecords(2);
// } else if (selectedIndexInPagination == 1) {
// vm.selectedIndexInPagination = 0;
// vm.showRecords(0);
// } else if (selectedIndexInPagination == 2) {
// vm.selectedIndexInPagination = 1;
// vm.showRecords(1);
// }
// };
// vm.begin = 0;
// vm.end = angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS);
// vm.selectedIndexInPagination = 0;
// vm.pagekey = 0;
// vm.showRecords = function(key){
// vm.selectedIndexInPagination = key;
// if (key == 0) {
// vm.begin = 0;
// vm.end = angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS);
// }
// if (key == 1) {
// vm.begin = angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS);
// vm.end = 2 * angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS);
// }
// if (key == 2) {
// vm.begin = 2 * angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS);
// vm.end = 3 * angular.copy(TOTAL_NO_OF_SINGLE_PAGE_RECORDS);
// }
// vm.currentRows = vm.end-vm.begin;
// vm.pagekey = key;
// };
// vm.first = function() {
// vm.pageNumber = angular.copy(TOTAL_NO_OF_RECORDS);
// vm.count = 1;
// initialLoad();
// vm.selectedIndexInPagination = 0;
// vm.showRecords(0);
// };
// vm.last = function(list) {
// vm.pageNumber = vm.check;
// vm.count = Math.floor(vm.pageNumber/angular.copy(TOTAL_NO_OF_RECORDS));
// vm.isLastClicked = true;
// initialLoad();    
// };
// vm.propertyName = 'UPDATE_TIMESTAMP';
// vm.reverse = true;			 
// vm.sortBy = function(propertyName) {
// vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
// if(vm.reverse == true){
// vm.order = "DESC";
// }else{
// vm.order = "ASC";
// }
// vm.propertyName = propertyName;
// initialLoad();
// };
// vm.searchRecords = function searchData(){
// dashboardService.searchDashBoard(vm.currentPosition, vm.personId, vm.searchItem
// ).success(function(result){debugger;
// console.log("search result is", result);
// vm.serviceRequestList = result.dashBoardDetailMap;
// });
// };
// function researchSummaryData(){
// dashboardService.researchSummaryData(vm.personId).success(function(result){
// vm.researchSummaryList = result.dashBoardResearchSummaryMap;
// });
// };
// researchSummaryData();
// vm.onEnterKeyPress = function onEnterKeyPress(event) {
// if(event.keyCode == 13) {
// vm.searchRecords();
// };
// };
// }