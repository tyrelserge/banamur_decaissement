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

  indexOfGroupedBudgetIdSelected: number | undefined;

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
    //this.budgetService.getBugdetIndexList(budgetsIndex => {
      //this.budgetsIndex = budgetsIndex;
    //});
  }

  onBudgetSectorSelected(form:NgForm) {
    this.budgetService.getBudgetSector(form.value['sector'], (budgetSector) => {
      this.budgetsector =  budgetSector;
    });
  }
  onGroupbudgetSelected(e:Event){
    e.preventDefault();
    if (this.budgetindexSelected) {
      this.budgetindexSelected = false;
      this.groupbudgetSelected = !this.groupbudgetSelected;
    }
  }
  onBudgetindexSelected(e:Event) {
    e.preventDefault();
    if (this.groupbudgetSelected) {
      this.groupbudgetSelected = false;
      this.budgetindexSelected = !this.budgetindexSelected;
    }
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
    let groupbudgetId = indexbudgetForm.controls['groupbudget'].value;
    console.log(groupbudgetId)
    this.budgetService.addBudgetIndex(this.user.userId, indexbudgetForm, (budgetIndex: BudgetIndex) => {
      this.budgetService.searchIndexIntoSelectedBudget(groupbudgetId, '', budgetsIndex => {
        this.budgetsIndex = budgetsIndex;
        indexbudgetForm.resetForm();
      });
    });
  }

  onClicGroupedBudget(savedbudgetForm: NgForm, indexbudgetForm: NgForm) {
    indexbudgetForm.resetForm();
    this.indexOfGroupedBudgetIdSelected = savedbudgetForm.controls['savedbudget'].value[0];
    this.budgetsIndex = new Array<BudgetIndex>();
    this.budgetService.getBugdetIndexList(budgetsIndex => {
      for(let i of budgetsIndex) {
      if (i.groupedbudgetId==this.indexOfGroupedBudgetIdSelected)
        this.budgetsIndex.push(i);
      }

      this.budgetService.getGroupBugdet(this.indexOfGroupedBudgetIdSelected, (groupBudget) => {
        this.groupBudget = groupBudget;
        this.budgetService.getBudgetSector(groupBudget.budgsectorId, (budgetSector) => {
          this.budgetsector =  budgetSector;
        });
      });
    });
  }

  InputSearchBudgetIndex(indexbudgetForm: NgForm) {
    this.budgetsIndex = new Array<BudgetIndex>();
    let input = indexbudgetForm.controls['indexname'].value;
    let groupbudgetId = indexbudgetForm.controls['groupbudget'].value;
    this.budgetService.searchIndexIntoSelectedBudget(groupbudgetId, input, budgetsIndex => {
      this.budgetsIndex = budgetsIndex;
    });
  }
  InputSearchGroupedBudget(groupbudgetForm: NgForm) {
    this.groupsBudget = new Array<GroupedBudget>();
    let input = groupbudgetForm.controls['groupname'].value;
    console.log(input)
    if (input) {
      this.budgetService.searchInputGroupedBudget(input, groupedBudget => {
        this.groupsBudget = groupedBudget;
      });
    } else {
      this.budgetService.getGroupBudgetList(groupsBudget => {
        this.groupsBudget = groupsBudget;
      });
    }
  }
}
