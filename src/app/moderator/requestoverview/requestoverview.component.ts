import { Component, OnInit } from '@angular/core';
import {Disbursement, ValidationAction} from "../../../models/disburs.model";
import {ActivatedRoute, Router} from "@angular/router";
import {DisbursService} from "../../../services/disburs.service";
import {UserService} from "../../../services/user.service";
import {Departement, Office, User} from "../../../models/user.model";
import {AuthService} from "../../../services/auth.service";
import {BudgetIndex, BudgetSecteur, GroupedBudget} from "../../../models/budget.model";
import {BudgetService} from "../../../services/budget.service";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-requestoverview',
  templateUrl: './requestoverview.component.html',
  styleUrls: ['./requestoverview.component.css']
})
export class RequestoverviewComponent implements OnInit {

  disbursement: Disbursement = new Disbursement();
  validations: ValidationAction[] = new Array<ValidationAction>();

  budgetsectors: BudgetSecteur[] = new Array<BudgetSecteur>();
  groupsBudget: GroupedBudget[] = new Array<GroupedBudget>();
  budgetsIndex: BudgetIndex[] = new Array<BudgetIndex>();

  validationChain: any[] = new Array<Object>();

  limitStep: number = 3;

  constructor(private authService: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private disbursService: DisbursService,
              private userService: UserService,
              private budgetService: BudgetService) { }

  ngOnInit(): void {
    if (!this.authService.isModerator()) this.router.navigate(['/']);

    const disbursId = this.activeRoute.snapshot.params['disbursid'];
    this.disbursService.getDisbursementRequest(disbursId, (disbursement) => {
      this.disbursement = disbursement;
      this.validations = disbursement.validations;
      // this.userService.getUser(disbursement.validations)
      this.disbursService.loadValidationChain(disbursement.validations, (data) => {
        this.validationChain = data;
      });
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

  formatIdentifier(createdOn: string | undefined, budgsectorId:number | undefined, identifier:string | undefined ) {
    if (createdOn!=undefined && budgsectorId!=undefined)
      return 'DECAISS' + formatDate(new Date(createdOn), 'yyMM', 'en_US') +
        '/' + this.disbursService.sectorIndexAlphab(budgsectorId.toString()) + identifier;
    return null;
  }

}
