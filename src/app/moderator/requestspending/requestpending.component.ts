import { Component, OnInit } from '@angular/core';
import {Disbursement} from "../../models/disburs.model";
import {DisbursService} from "../../services/disburs.service";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {BudgetService} from "../../services/budget.service";
import {BudgetIndex, BudgetSecteur, GroupedBudget} from "../../models/budget.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-requestpending',
  templateUrl: './requestpending.component.html',
  styleUrls: ['./requestpending.component.css']
})
export class RequestpendingComponent implements OnInit {

  user: User = new User();
  users: User[] = new Array<User>();

  allDisbursement: Disbursement[] = new Array<Disbursement>();
  pendingDisburs: Disbursement[] = new Array<Disbursement>();

  budgetsectors: BudgetSecteur[] = new Array<BudgetSecteur>();
  groupsBudget: GroupedBudget[] = new Array<GroupedBudget>();
  budgetsIndex: BudgetIndex[] = new Array<BudgetIndex>();

  countAllDisburs: number = 0;
  countPending: number = 0;

  current: number = 0;
  approved: number = 0;
  rejected: number = 0;

  constructor(private authService: AuthService,
              private router: Router,
              private disbursService: DisbursService,
              private budgetService: BudgetService,
              private userService: UserService) { }

  ngOnInit(): void {
    if (!this.authService.isModerator()) this.router.navigate(['/']);

    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));

    this.userService.getUserList((users:User[]) => {
        this.users = users;
    })

    this.disbursService.getPendingDisbursements((disbursements: Disbursement[]) => {
      if (this.authService.checkUserLevel(this.user, '111')) {
        this.countPending = 0;
        this.pendingDisburs = disbursements;
        for(let disb of disbursements) {
          if (!this.checktreatedValidation(disb))
            this.countPending += 1;
        }
      } else {
        this.countPending = 0;
        for(let disb of disbursements) {
          if (disb.currentStep!=null && disb.currentStep!='0') {
            this.pendingDisburs.push(disb)
            if (!this.checktreatedValidation(disb))
            this.countPending += 1;
          }
        }
      }
    })
    this.disbursService.getAllDisbursements((disbursements:Disbursement[]) => {
      this.allDisbursement = disbursements;
      /*
      for(let i of disbursements) {
        this.allDisbursement.push(i)
        this.countAllDisburs += 1;
      } */
      //this.disbursService.treatedValidation(this.user.userId, disbursements, (data) => {
        //this.treated = data;
      //});
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

  checktreatedValidation(disbursement: Disbursement) {

    for (let val of disbursement.validations) {
      if (val.userId == this.user.userId) {
        return true;
      }
    }
    return false;
    // this.disbursService.treatedValidation(this.user.userId, disbursement, (treated:boolean) => {
     // return treated;
   //});
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
