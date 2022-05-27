import { Component, OnInit } from '@angular/core';
import {Disbursement} from "../../../models/disburs.model";
import {DisbursService} from "../../../services/disburs.service";
import {ActivatedRoute} from "@angular/router";
import {formatDate} from "@angular/common";
import {BudgetService} from "../../../services/budget.service";
import {BudgetIndex, BudgetSecteur, GroupedBudget} from "../../../models/budget.model";

@Component({
  selector: 'app-browserequest',
  templateUrl: './browserequest.component.html',
  styleUrls: ['./browserequest.component.css']
})
export class BrowserequestComponent implements OnInit {

  disbursement: Disbursement = new Disbursement();
  validationChain: any[] = new Array<Object>();
  budgetsectors: BudgetSecteur[] = new Array<BudgetSecteur>();
  groupsBudget: GroupedBudget[] = new Array<GroupedBudget>();
  budgetsIndex: BudgetIndex[] = new Array<BudgetIndex>();

  constructor(private activeRoute: ActivatedRoute, private disbursService: DisbursService,
              private budgetService: BudgetService) { }

  ngOnInit(): void {
    const disbursId = this.activeRoute.snapshot.params['disbursid'];
    this.disbursService.getDisbursementRequest(disbursId, (data) => {
      this.disbursement = data;
      this.disbursService.loadValidationChain(data.validations, (data) => {
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

/*
  formatIdentifier(createdOn: string | undefined, budgsectorId:number | undefined, identifier:string | undefined ) {
    if (createdOn!=undefined && budgsectorId!=undefined)
      return '' + formatDate(new Date(createdOn), 'yyMM', 'en_US') +
        '/' + this.disbursService.sectorIndexAlphab(budgsectorId.toString()) + identifier;
    return null;
  }
*/

}
