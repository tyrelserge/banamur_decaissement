import { Component, OnInit } from '@angular/core';
import {Disbursement} from "../../models/disburs.model";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {DisbursService} from "../../services/disburs.service";

@Component({
  selector: 'app-claimant',
  templateUrl: './claimant.component.html',
  styleUrls: ['./claimant.component.css']
})
export class ClaimantComponent implements OnInit {

  user: User = new User();
  disbursements: Disbursement[] = new Array<Disbursement>();

  current: number = 0;
  approved: number = 0;
  rejected: number = 0;

  constructor(private authService: AuthService,
              private disbursService: DisbursService,
              ) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));
    this.disbursService.getUserDisbursementList(this.user.userId, (data) =>{
      for(let i of data) {
        this.disbursements.push(i)
      }
      this.countStatus(data);
    });
  }

  countStatus(disbursements: Disbursement[]) {
    for (let disb of disbursements) {
      if(disb.status=='submitted') this.current += 1;
      if(disb.status=='approved') this.approved += 1;
      if(disb.status=='rejected') this.rejected += 1;
    }
  }



}
