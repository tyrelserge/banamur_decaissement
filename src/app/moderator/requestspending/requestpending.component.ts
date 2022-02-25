import { Component, OnInit } from '@angular/core';
import {Disbursement} from "../../../models/disburs.model";
import {DisbursService} from "../../../services/disburs.service";
import {User} from "../../../models/user.model";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-requestpending',
  templateUrl: './requestpending.component.html',
  styleUrls: ['./requestpending.component.css']
})
export class RequestpendingComponent implements OnInit {

  user: User = new User();

  allDisbursement: Disbursement[] = new Array<Disbursement>();
  pendingDisburs: Disbursement[] = new Array<Disbursement>();

  countAllDisburs: number = 0;
  countPending: number = 0;

  current: number = 0;
  approved: number = 0;
  rejected: number = 0;

  treated: boolean = false;

  constructor(private authService: AuthService, private disbursService: DisbursService) { }

  ngOnInit(): void {
    if (!this.authService.isAuth()) return;
    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));
    this.disbursService.getPendingDisbursements((disbursements) => {
      for(let disb of disbursements) {
        this.pendingDisburs.push(disb)
        this.countPending += 1;
      }
      this.disbursService.treatedValidation(this.user.userId, disbursements, (data) => {
        this.treated = data;
      });
    })
    this.disbursService.getAllDisbursements((disbursements) => {
      for(let i of disbursements) {
        this.allDisbursement.push(i)
        this.countAllDisburs += 1;
      }
      this.disbursService.treatedValidation(this.user.userId, disbursements, (data) => {
        this.treated = data;
      });
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
