import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng2CompleterModule } from 'ng2-completer';
import { FileDropModule } from 'ngx-file-drop';

import { GrantComponent } from './grant.component';

import { GrantService } from "./grant.service";

const routes = [{ path: '', component: GrantComponent }]; 

@NgModule( {
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        Ng2CompleterModule,
        FileDropModule,
        RouterModule.forChild( routes )
        
    ],
    declarations: [
        GrantComponent
    ],
       
    providers: [GrantService]
} )
export class GrantModule { }
