import { Component, OnInit } from '@angular/core';
import {Disbursement} from "../../models/disburs.model";
import {DisbursService} from "../../services/disburs.service";
import {AuthService} from "../../services/auth.service";
import {BudgetIndex, BudgetSecteur, GroupedBudget} from "../../models/budget.model";
import {formatDate} from "@angular/common";
import { User } from 'src/app/models/user.model';
import { BudgetService } from 'src/app/services/budget.service';

@Component({
  selector: 'app-claimantrequest',
  templateUrl: './claimantrequest.component.html',
  styleUrls: ['./claimantrequest.component.css']
})
export class ClaimantrequestComponent implements OnInit {

  user: User = new User();

  disbursements: Disbursement[] = new Array<Disbursement>();

  budgetsectors: BudgetSecteur[] = new Array<BudgetSecteur>();
  groupsBudget: GroupedBudget[] = new Array<GroupedBudget>();
  budgetsIndex: BudgetIndex[] = new Array<BudgetIndex>();

  current: number = 0;
  approved: number = 0;
  rejected: number = 0;

  constructor(private authService: AuthService,
              private disbursService: DisbursService,
              private budgetService: BudgetService) { }

  ngOnInit(): void {

    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));
    this.disbursService.getUserDisbursementList(this.user.userId, (data) =>{
      for(let i of data) {
        this.disbursements.push(i)
      }
      this.countStatus(data);
    });

    this.budgetService.getBudgetSectorList((budgetSectors) => {
      this.budgetsectors = budgetSectors
    });

    this.budgetService.getGroupBudgetList(groupsBudget => {
      this.groupsBudget = groupsBudget;
    });

    this.budgetService.getBugdetIndexList((budgetsIndex)=> {
      this.budgetsIndex = budgetsIndex;
    });
  }

  countStatus(disbursements: Disbursement[]) {
    for (let disb of disbursements) {
      if(disb.status=='submitted') this.current += 1;
      if(disb.status=='approved') this.approved += 1;
      if(disb.status=='rejected') this.rejected += 1;
    }
  }

  /*
  formatIdentifier(createdOn: string | undefined, budgsectorId:number | undefined, identifier:string | undefined ) {
    if (createdOn!=undefined && budgsectorId!=undefined)
      return '' + formatDate(new Date(createdOn), 'yyMM', 'en_US') +
        '/' + this.disbursService.sectorIndexAlphab(budgsectorId.toString()) + identifier;
    return null;
  }
  */
}
