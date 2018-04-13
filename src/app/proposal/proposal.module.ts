import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { ProposalComponent } from './proposal.component';

const routes = [{path: '', component: ProposalComponent},
                {path: 'createProsal', component: ProposalComponent}];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProposalComponent]
})
export class ProposalModule { }
