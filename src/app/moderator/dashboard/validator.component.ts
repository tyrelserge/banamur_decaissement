import { Component, OnInit } from '@angular/core';
import {Disbursement} from "../../../models/disburs.model";
import {AuthService} from "../../../services/auth.service";
import {DisbursService} from "../../../services/disburs.service";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css']
})
export class ValidatorComponent implements OnInit {

  disbursements: Disbursement[] = new Array<Disbursement>();
  countPending: number = 0;

  constructor(private authService: AuthService, private disbursService: DisbursService) { }

  ngOnInit(): void {
    if (this.authService.isAuth()) {
      // @ts-ignore
      this.user = <User>(JSON.parse(localStorage.getItem('user')));
      this.disbursService.getPendingDisbursements((data) => {
        for(let i of data) {
          this.disbursements.push(i)
          this.countPending += 1;
        }
      })
    }
  }

}
