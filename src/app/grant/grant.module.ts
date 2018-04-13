import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileDropModule } from 'ngx-file-drop';

import { GrantComponent } from './grant.component';

import { GrantService } from "./grant.service";

const routes = [{ path: '', component: GrantComponent },
                { path: 'grant', component: GrantComponent }]; 

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( routes ),
        FileDropModule
        
    ],
    declarations: [
        GrantComponent
    ],
       
    providers: [GrantService]
} )
export class GrantModule { }
