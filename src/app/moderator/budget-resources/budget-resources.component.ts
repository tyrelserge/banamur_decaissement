import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {BudgetService} from "../../../services/budget.service";
import {User} from "../../../models/user.model";
import {BudgetIndex, BudgetSecteur, GroupedBudget} from "../../../models/budget.model";

@Component({
  selector: 'app-budget-resources',
  templateUrl: './budget-resources.component.html',
  styleUrls: ['./budget-resources.component.css']
})
export class BudgetResourcesComponent implements OnInit {

  user: User = new User();
  budgetsectors: BudgetSecteur[] = new Array<BudgetSecteur>();
  budgetsector: BudgetSecteur = new BudgetSecteur();

  groupbudgetSelected: boolean = true;
  budgetindexSelected: boolean = false;

  groupsBudget: GroupedBudget[] = new Array<GroupedBudget>();
  budgetsIndex: BudgetIndex[] = new Array<BudgetIndex>();
  groupBudget: GroupedBudget = new GroupedBudget();

  constructor(private authService: AuthService,
              private userService:UserService,
              private router: Router,
              private budgetService: BudgetService) { }

  ngOnInit(): void {
    if (!this.authService.isAuth()) this.router.navigate(['/']);

    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));

    this.budgetService.getBudgetSectorList((budgetSectors) => {
      this.budgetsectors = budgetSectors
    });

    this.budgetService.getGroupBudgetList(groupsBudget => {
      this.groupsBudget = groupsBudget;
    });
    this.budgetService.getBugdetIndexList(budgetsIndex => {
      this.budgetsIndex = budgetsIndex;
    });
  }

  onBudgetSectorSelected(form:NgForm) {
    this.budgetService.getBudgetSector(form.value['sector'], (budgetSector) => {
      this.budgetsector =  budgetSector;
    });
  }
  onGroupbudgetSelected(e:Event){
    e.preventDefault();
    this.budgetindexSelected = false;
    this.groupbudgetSelected = !this.groupbudgetSelected;
  }
  onBudgetindexSelected(e:Event){
    e.preventDefault();
    this.groupbudgetSelected = false;
    this.budgetindexSelected = !this.budgetindexSelected;
  }

  onChangeGroupBudgetSelect(indexbudgetForm: NgForm) {
    this.budgetService.getGroupBugdet(indexbudgetForm.controls['groupbudget'].value, (groupBudget) => {
      this.groupBudget = groupBudget;
      this.budgetService.getBudgetSector(groupBudget.budgsectorId, (budgetSector) => {
        this.budgetsector =  budgetSector;
      });
    });
  }

  onGroupBudgetSubmit(groupbudgetForm: NgForm) {
    this.budgetService.addGroupBudget(this.user.userId, groupbudgetForm, (groupBudget: GroupedBudget) => {
      this.budgetService.getGroupBudgetList(groupsBudget => {
        this.groupsBudget = groupsBudget;
        groupbudgetForm.resetForm();
      })
    });
  }
  onIndexBudgetSubmit(indexbudgetForm: NgForm) {
    console.log(indexbudgetForm.value);
    this.budgetService.addBudgetIndex(this.user.userId, indexbudgetForm, (budgetIndex: BudgetIndex) => {
      this.budgetService.getBugdetIndexList(budgetsIndex => {
        this.budgetsIndex = budgetsIndex;
        indexbudgetForm.resetForm();
      });
    });
  }
}
