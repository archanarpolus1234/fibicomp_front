import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-committee-members',
  templateUrl: './committee-members.component.html',
  styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
})

export class CommitteeMembersComponent implements OnInit {
  addRole : boolean = false;
  addExpertise : boolean = false;
  showMembers : boolean = false;
  constructor() { }

  ngOnInit() {
  }
  
  addRoles($event){
      event.preventDefault();
      this.addRole = !this.addRole;
  }
  
  addExpertises($event){
      event.preventDefault();
      this.addExpertise = !this.addExpertise;
  }
  
  showMembersTab($event){
      event.preventDefault();
      this.showMembers = !this.showMembers;
  }
}
