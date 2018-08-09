import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalComponent } from './proposal.component';
import { ProposalHomeComponent } from './proposal-home/proposal-home.component';
import { AwardBudgetComponent } from './award-budget/award-budget.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2CompleterModule } from 'ng2-completer';
import { FileDropModule } from 'ngx-file-drop';

import { CommitteeMemberNonEmployeeElasticService  } from '../elastic-search/committee-members-nonEmployee-elastic-search.service';
import { CommitteeMemberEmployeeElasticService } from '../elastic-search/committee-members-employees-elastic-search.service';
import { GrantService } from "../grant/grant.service";
import { ProposalCreateEditService } from '../proposal/proposal-create-view.service';
import {ProposalBudgetService} from './award-budget/award-budget.service';

let routes = [{ path: '', component: ProposalComponent,
                children:[{ path: '', component: ProposalHomeComponent, pathMatch: 'full' },
                          { path: 'proposalHome', component: ProposalHomeComponent},
                          { path: 'proposalBudget', component: AwardBudgetComponent},
                          { path: 'viewSubmittedProposal', component: ProposalHomeComponent}
                        ]},
              { path: 'createProposal', component: ProposalComponent },
              { path: 'editProposal', component: ProposalComponent }/*,
              { path: 'viewSubmittedProposal', component: ProposalComponent}*/];

@NgModule({
  imports: [
    CommonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule, ReactiveFormsModule,
    Ng2CompleterModule,
	FileDropModule,
    RouterModule.forChild( routes )
  ],
  declarations: [ProposalComponent, ProposalHomeComponent, AwardBudgetComponent],
  providers: [ CommitteeMemberEmployeeElasticService, CommitteeMemberNonEmployeeElasticService, GrantService, ProposalBudgetService]
})
export class ProposalModule { }
