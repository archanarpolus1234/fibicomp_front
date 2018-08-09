import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionManagementService } from "../../session/session-management.service";
import { Subject, Observable } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import { CompleterService, CompleterData } from "ng2-completer";
import { SlicePipe } from '@angular/common';
import { FormsModule, FormGroup, FormControl, FormControlName } from '@angular/forms';
import * as _ from "lodash";

import { ProposalCreateEditService } from "../proposal-create-view.service";
import { ProposalBudgetService } from "./award-budget.service";
import 'rxjs/Rx';

declare var $: any;

@Component( {
    selector: 'award-budget-component',
    templateUrl: './award-budget.component.html',
    styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
} )
export class AwardBudgetComponent implements OnInit {

    isPeriodSelected: boolean = true;
    isPeriodTotalSelected: boolean = false;
    isCumulativeSelected: boolean = false;
    isPeriodOpen: boolean = false;
    proposalId: string;
    editClass: string = "committeeBox";
    editAreaClass: string = 'scheduleBoxes';
    mode: string = 'view';
    proposalObject: any = {};
    createBudgetData: any;
    budgetData: any;
    costElements: any;
    sysGeneratedCostElements: any = [];
    selectedCostElement: string;
    listCEinAutoSuggest: any = [];
    budgetDetails: any = [];
    budgetDetail: any = {};
    isOverviewWdgtOpen: boolean = true;
    isBudgetOverviewWdgtOpen: boolean = true;
    proposal: any = {};
    budgetHeader: any = {};
    budgetPeriods: any = [];
    isAutoCalculate: boolean = false;
    currentUser: string = localStorage.getItem( 'currentUser' );
    showRatesModal: boolean = false;
    selectedPeriod: number = 1;
    isApplyRates: boolean = false;
    temp: any;
    showBudgetSaveModal: boolean = false;
    isInvalidLineItem: boolean = false;
    rateClassTypes: any = [];
    selectedRateClassType: string = 'Inflation';
    showSaveBudgetModal = false;

    private budget_proposal_subscription: ISubscription;
    private budget_costElements_subscription: ISubscription;
    private sysGeneratedCostElements_subscription: ISubscription;

    constructor( public _ngZone: NgZone, public changeRef: ChangeDetectorRef, public route: ActivatedRoute, private router: Router, private sessionService: SessionManagementService, private proposalCreateService: ProposalCreateEditService, private proposalBudgetService: ProposalBudgetService, public completerService: CompleterService ) {
    }
    ngOnInit() {
        this.proposalCreateService.setProposalTab('BUDGET');
        this.proposalId = this.route.snapshot.queryParamMap.get('proposalId');
        this.budget_proposal_subscription = this.proposalCreateService.proposalObjectVariable.subscribe( proposalObject => {
            this.proposalObject = proposalObject;
        } );
        if((JSON.stringify(this.proposalObject) == {} || this.proposalObject == undefined || this.proposalObject == null || (this.proposalObject && (Object.keys(this.proposalObject).length === 0))) && this.proposalId != null) {
            this.proposalCreateService.loadProposalById(this.proposalId, localStorage.getItem('personId'), localStorage.getItem('currentUser')).subscribe(success => {
                var temp: any = {};
                temp = success;
                this.proposalObject = temp.proposal;
                this.costElements = temp.costElements;
                this.rateClassTypes = temp.rateClassTypes;
                this.proposalCreateService.setProposalData(this.proposalObject);
                this.sysGeneratedCostElements = temp.sysGeneratedCostElements;
                this.loadInitialData(this.proposalObject);
            });
        }
        if(this.proposalObject.hasOwnProperty('budgetHeader') &&  this.proposalObject.budgetHeader== null) {
            this.proposalBudgetService.createProposalBudget( localStorage.getItem( 'currentUser' ), localStorage.getItem( 'userFullname' ), this.proposalObject ).subscribe( data => {
                 this.budgetData = data || [];
                 this.proposalCreateService.setBudgetData(this.budgetData.costElements);
                 this.costElements = this.budgetData.costElements;
                 this.rateClassTypes = this.budgetData.rateClassTypes;
                 this.proposalBudgetService.setSysGeneratedCostElements(this.budgetData.sysGeneratedCostElements);
                 this.sysGeneratedCostElements = this.budgetData.sysGeneratedCostElements;
                 this.loadInitialData(this.budgetData.proposal);
           });
       } else {
           this.budget_costElements_subscription = this.proposalCreateService.budgetDataVariable.subscribe( budgetData => {
               this.costElements = budgetData;
           } );
           this.sysGeneratedCostElements_subscription = this.proposalBudgetService.sysGeneratedCostElementsDataVariable.subscribe( sysGeneratedCostElementsData => {
               this.sysGeneratedCostElements = sysGeneratedCostElementsData;
           } );
           this.loadInitialData(this.proposalObject);
       }
    }

    loadInitialData(proposalObject) {
        if ( this.proposalObject.proposalStatus.statusCode == 1 || this.proposalObject.proposalStatus.statusCode == 9 ) {
            this.mode = 'edit';
            this.editClass = "committeeBox";
            this.editAreaClass = "scheduleBoxes";
        } else {
            this.mode = 'view';
            this.editClass = "committeeBoxNotEditable";
            this.editAreaClass = "scheduleBoxes";
        }
        this.createBudgetData = proposalObject;
        if(this.createBudgetData != null || this.createBudgetData != {}) {
            this.proposal = this.createBudgetData;
            if(this.proposal != null && this.createBudgetData.budgetHeader != null) {
                this.budgetHeader = this.createBudgetData.budgetHeader;
                if (this.createBudgetData.budgetHeader.startDate == null) {
                    this.createBudgetData.budgetHeader.startDate = this.createBudgetData.startDate;
                }
                if (this.createBudgetData.budgetHeader.endDate == null) {
                    this.createBudgetData.budgetHeader.endDate = this.createBudgetData.endDate;
                }
                if(this.createBudgetData.budgetHeader.isAutoCalc != null) {
                    this.isAutoCalculate = this.createBudgetData.budgetHeader.isAutoCalc;
                }
                //this.isPeriodOpen = true;
                this.listCEinAutoSuggest = this.completerService.local( this.costElements, 'costElementDetail', 'costElementDetail' );
                this.budgetPeriods = this.createBudgetData.budgetHeader.budgetPeriods;
                this.budgetDetail.budgetCategory = null;
                if(this.budgetPeriods.length == 0) {
                    var periodItem: any = {};
                    periodItem.budgetPeriod = 1;
                    periodItem.totalCost = 0;
                    periodItem.totalDirectCost = 0;
                    periodItem.totalIndirectCost = 0;
                    periodItem.periodLabel = 'Period';
                    periodItem.startDate = this.createBudgetData.budgetHeader.startDate;
                    periodItem.endDate = this.createBudgetData.budgetHeader.endDate;
                    this.budgetPeriods.push(periodItem);
                }
            }
        }
    }

    dateValidation() {
        if(this.budgetPeriods.length == 1) {
            this.budgetPeriods[0].startDate =  this.createBudgetData.budgetHeader.startDate;
            this.budgetPeriods[0].endDate = this.createBudgetData.budgetHeader.endDate;
        }
        /*
        if ( this.createBudgetData.proposal.budgetHeader.startDate == null ) {
            this.isPeriodOpen = false;
        } else if ( this.createBudgetData.proposal.budgetHeader.endDate == null ) {
            this.isPeriodOpen = false;
        } else if ( this.createBudgetData.proposal.budgetHeader.startDate > this.createBudgetData.proposal.budgetHeader.endDate ) {
            this.isPeriodOpen = false;
        } else {
            this.budgetPeriods[0] = {};
            this.budgetPeriods[0].startDate = this.createBudgetData.proposal.budgetHeader.startDate;
            this.budgetPeriods[0].endDate = this.createBudgetData.proposal.budgetHeader.endDate;
            this.isPeriodOpen = true;
        }
    */}

    costElementChangeFunction() {
        if(this.selectedCostElement == "") {
            this.budgetDetail.costElement = null;
            this.budgetDetail.budgetCategory = null;
            this.budgetDetail.budgetCategoryCode = null;
        } else {
            for ( let item of this.costElements ) {
                if ( item.costElementDetail == this.selectedCostElement ) {
                    this.budgetDetail.costElement = item;
                    this.budgetDetail.costElementCode = item.costElement;
                    this.budgetDetail.budgetCategory = item.budgetCategory;
                    this.budgetDetail.budgetCategoryCode = item.budgetCategoryCode;
                }
            }
        }
    }

    _keyPress(event: any) {
        const pattern = /[0-9\+\-\/\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
          event.preventDefault();
        }
    }

    changeAutoCal(value) {
        this.isAutoCalculate = value;
        this.createBudgetData.budgetHeader.isAutoCalc = this.isAutoCalculate;
        if(value == true) {
            for(let periods of this.budgetPeriods) {
              for(let lineItem of periods.budgetDetails) {
                if(lineItem.isSystemGeneratedCostElement==true) {
                    lineItem.lineItemCost = 0;
                }
              }
            }
        }
    }

    addBudgetDetail(budgetPeriodNumber) {
        if(this.budgetDetail.costElement != null) {
            this.isInvalidLineItem = false;
            this.budgetDetail.budgetPeriod = budgetPeriodNumber;
            var temp: any = {};
            temp = Object.assign({}, this.budgetDetail); // making a clone this.isAutoCalculate
            this.budgetDetails.push(temp);
            for(var i=0; i<this.budgetPeriods.length;i++) {
                if(this.budgetPeriods[i].budgetPeriod == this.budgetDetail.budgetPeriod){
                for(var j=0; j<this.budgetDetails.length;j++) {
                    if(this.budgetDetails[j].budgetPeriod == this.budgetPeriods[i].budgetPeriod && this.budgetPeriods[i].budgetDetails.indexOf(this.budgetDetails[j]) == -1){
                    if(this.budgetPeriods[i].budgetDetails.length <= 0) {
                       for(let sysCost of this.sysGeneratedCostElements){
                            var tempSysCost: any = {};
                            tempSysCost.budgetCategory = sysCost.budgetCategory;
                            tempSysCost.budgetCategoryCode = sysCost.budgetCategoryCode;
                            tempSysCost.budgetPeriod = budgetPeriodNumber;
                            tempSysCost.costElement = sysCost;
                            tempSysCost.costElementCode = sysCost.costElement;
                            tempSysCost.lineItemDescription = null;
                            tempSysCost.isSystemGeneratedCostElement = true;
                            tempSysCost.systemGeneratedCEType = sysCost.systemGeneratedCEType;
                            if(this.isAutoCalculate) {
                                tempSysCost.lineItemCost = null;
                                tempSysCost.description = null;
                            }                      
                            this.budgetPeriods[i].budgetDetails.push(tempSysCost);
                        }
                    }
                    this.budgetPeriods[i].budgetDetails.unshift(this.budgetDetails[j]);
                    this.budgetDetail.costElement = null;
                    this.budgetDetail.budgetCategory = null;
                    this.budgetDetail.budgetCategoryCode = null;
                    this.budgetDetail.lineItemDescription = null;
                    this.budgetDetail.lineItemCost = null;
                    this.budgetDetail.budgetPeriod = null;
                    this.selectedCostElement = null;
                    //this.budgetDetails = [];
                    //this.budgetDetail = {};
                    this.calcBudgetPeriodTotalCost(budgetPeriodNumber-1);
                    this.calcFinalBudgetCost();
                    //this.tempArray = [];
                    }
              }
              }
        }
      } else {
            this.isInvalidLineItem = true;
        }
           
    }

    calcBudgetPeriodTotalCost(budgetPeriodNumber) {
        if(this.budgetDetails.length > 0) {
            var periodTotalCost = 0;
            var periodTotalDirect = 0;
            var periodTotalIndirect = 0;
            for(let lineItem of this.budgetDetails) {
                periodTotalDirect += lineItem.lineItemCost;
            }
            periodTotalCost = periodTotalCost + periodTotalDirect + periodTotalIndirect;
            this.budgetPeriods[budgetPeriodNumber].totalCost = periodTotalCost;
            this.budgetPeriods[budgetPeriodNumber].totalDirectCost = periodTotalDirect;
            this.budgetPeriods[budgetPeriodNumber].totalIndirectCost = periodTotalIndirect;
            
        }
    }

    calcFinalBudgetCost() {
        if(this.budgetPeriods.length > 0) {
            var finalTotalCost = 0;
            var finalTotalDirect = 0;
            var finalTotalIndirect = 0;
            for(let period of this.budgetPeriods) {
                finalTotalCost += period.totalCost; 
                finalTotalDirect += period.totalDirectCost;
                finalTotalIndirect += period.totalIndirectCost;
            }
            this.createBudgetData.budgetHeader.totalDirectCost = finalTotalDirect;
            this.createBudgetData.budgetHeader.totalIndirectCost = finalTotalIndirect;
            this.createBudgetData.budgetHeader.totalCost = finalTotalCost;
        }
    }
    
    deleteLineItem(lineItem, budgetPeriodId, budgetPeriodNumber, index) {/*
        for(let item of this.budgetPeriods[budgetPeriodNumber-1].budgetDetails) {
            if(item.budgetDetailId == null){  if lineItem not saved
                //var index: number = this.budgetPeriods[budgetPeriodNumber].budgetDetails.indexOf(item);
                //if (index !== -1) {
                    this.budgetPeriods[budgetPeriodNumber-1].budgetDetails.splice(index, 1);
                //}
            } else if(item.budgetDetailId == lineItem.budgetDetailId){
                this.proposalBudgetService.deleteBudgetLineItem( budgetPeriodId, item.budgetDetailId, this.createBudgetData ).subscribe( data => {
                    var temp:any = {};
                    temp = data || [];
                    this.budgetPeriods = temp.proposal.budgetHeader.budgetPeriods;
                });
            }
        }
    */}
    
    deleteBudgetPeriod(budgetPeriodId) {/*
        this.proposalBudgetService.deleteBudgetPeriod( budgetPeriodId, this.createBudgetData ).subscribe( data => {
            var temp:any = {};
            temp = data || [];
            this.budgetPeriods = temp.proposal.budgetHeader.budgetPeriods;
        });
    */}

    saveProposalBudget() {
        //var type = ( this.createBudgetData.proposal.proposalId != null ) ? "UPDATE" : "SAVE";
        var type = 'SAVE';
        this.createBudgetData.budgetHeader.isAutoCalc = this.isAutoCalculate;
        //this.budgetPeriods.budgetDetails = this.budgetDetails;
        this.createBudgetData.budgetHeader.budgetPeriods = this.budgetPeriods;
        if(this.createBudgetData.budgetHeader.startDate != null && this.createBudgetData.budgetHeader.endDate != null) {
            this.createBudgetData.updateUser = this.currentUser;
            this.createBudgetData.updateTimeStamp = new Date().getTime();
            this.showSaveBudgetModal = true;
            this.proposalCreateService.saveProposal( this.createBudgetData, type ).subscribe( data => {
                this.temp = {};
                this.temp = data;
                if(this.temp.message != null) {
                    //alert("Budget saved Successfully");
                   //document.getElementById('saveBudgetHidden').click();
                }
                this.proposalCreateService.setProposalData(this.temp.proposal);
                this.budgetPeriods = this.temp.proposal.budgetHeader.budgetPeriods;
                //this.budgetDetails = [];
                this.changeRef.detectChanges();
                if(!this.isAutoCalculate) {
                    this.calcFinalBudgetCost();
                }
            } ),
            err => {},
            () => {
                
            };
        }
    }

    closeBudgetSaveModal() {
        this.showSaveBudgetModal = false;
    }

    showRates(event: any) {
        this.showRatesModal = true;
    }
    
    changeApplicableRate(rateObj, changeRate) {
        this.isApplyRates = true;
        for(let rate of this.createBudgetData.budgetHeader.proposalRates) {
            if(rate.proposalRateId == rateObj.proposalRateId){
                rate.applicableRate = changeRate;
            }
        }
    }
    
    applyRates() {
        
        this.proposalBudgetService.applyRates( localStorage.getItem( 'currentUser' ), localStorage.getItem( 'userFullname' ), this.createBudgetData ).subscribe( data => {
            var temp:any = {};
            temp = data || [];
            this.createBudgetData = temp.proposal;
      });
    }
    
    resetBudgetRates() {
        
        this.proposalBudgetService.resetBudgetRates( localStorage.getItem( 'currentUser' ), localStorage.getItem( 'userFullname' ), this.createBudgetData ).subscribe( data => {
            var temp: any = {};
            temp = data || [];
            this.createBudgetData = temp.proposal;
      });
    }
    
    getSyncBudgetRates() {
        
        this.proposalBudgetService.getSyncBudgetRates( localStorage.getItem( 'currentUser' ), localStorage.getItem( 'userFullname' ), this.createBudgetData ).subscribe( data => {
            var temp: any = {};
            temp = data || [];
            this.createBudgetData = temp.proposal;
      });
    }
    
    changeTab(tabLabel, periodNumber) {
       if(tabLabel == 'PERIOD_AND_TOTAL') {
           this.selectedPeriod = periodNumber;
           this.isPeriodSelected = false;
            this.isPeriodTotalSelected = true;
            
       } else if(tabLabel == 'PERIODS') {
           this.selectedPeriod = periodNumber;
           this.isPeriodSelected = true;
           this.isPeriodTotalSelected = false;
       }
    }
    
    setPeriodAndTotalDirectCost(cost, periodNumber) {
        this.budgetPeriods[periodNumber-1].totalCost = 0;
        if(this.budgetPeriods[periodNumber-1].totalIndirectCost != null) {
            this.budgetPeriods[periodNumber-1].totalCost = parseInt(this.budgetPeriods[periodNumber-1].totalIndirectCost) + parseInt(cost);
        } else {
            this.budgetPeriods[periodNumber-1].totalCost = cost;
        }
        this.createBudgetData.budgetHeader.budgetPeriods[periodNumber-1].totalDirectCost = cost;
        this.createBudgetData.budgetHeader.budgetPeriods[periodNumber-1].totalCost = this.budgetPeriods[periodNumber-1].totalCost;
        
    }
    
    setPeriodAndTotalIndirectCost(cost, periodNumber) {
    this.budgetPeriods[periodNumber-1].totalCost = 0;
    if(this.budgetPeriods[periodNumber-1].totalDirectCost != null) {
        this.budgetPeriods[periodNumber-1].totalCost = parseInt(this.budgetPeriods[periodNumber-1].totalDirectCost) + parseInt(cost);
    } else {
        this.budgetPeriods[periodNumber-1].totalCost = cost;
    }
        this.createBudgetData.budgetHeader.budgetPeriods[periodNumber-1].totalIndirectCost = cost;
        this.createBudgetData.budgetHeader.budgetPeriods[periodNumber-1].totalCost = this.budgetPeriods[periodNumber-1].totalCost;
    }
}

(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
    });

    $(document).ready(function(){    
     if($('#mytest').hasScrollBar())
     {
       $('.tableSection thead').toggleClass('extrawidth');
     }
    });
    
    /*"createBudgetData.budgetHeader.budgetPeriod[period.budgetPeriod].totalDirectCost"
    "createBudgetData.budgetHeader.budgetPeriod[period.budgetPeriod].totalIndirectCost"
    "createBudgetData.budgetHeader.budgetPeriod[period.budgetPeriod].totalCost"
*/