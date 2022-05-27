import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {BudgetIndex, BudgetSecteur, GroupedBudget} from "../../../models/budget.model";
import {NgForm} from "@angular/forms";
import {BudgetService} from "../../../services/budget.service";
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {DisbursService} from "../../../services/disburs.service";
import {ReasonItems} from "../../../models/disburs.model";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-disbursement',
  templateUrl: './disbursement.component.html',
  styleUrls: ['./disbursement.component.css']
})
export class DisbursementComponent implements OnInit {

  today = new Date();

  user:User = new User();
  users:User[] = new Array<User>();

  budgsector: BudgetSecteur = new BudgetSecteur();
  groupedBudget: GroupedBudget[] = new Array<GroupedBudget>();
  budgetIndex: BudgetIndex[] = new Array<BudgetIndex>();

  nexDisbursNumber: string | undefined;
  numregister: string | undefined;

  cumulateAmount: number = 0;

  showInputBeneficiary:  boolean = false;
  showSelectBeneficiary: boolean = false;
  showSelectedBeneficiary: boolean = false;

  showDetailsFields: boolean = false;

  reasons: ReasonItems[] = new Array<ReasonItems>();
  reasonIds: number[] = new Array();
  searchResult: User[] | undefined;

  constructor(private authService: AuthService,
              private activeRoute: ActivatedRoute,
              private httpClient: HttpClient,
              private router: Router,
              private budgetService: BudgetService,
              private userService:UserService,
              private disbursService: DisbursService) {
  }

  ngOnInit(): void {
    if (!this.authService.isAuth()) this.router.navigate(['/']);

    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));

    // @ts-ignore
    this.users = <User[]>(JSON.parse(localStorage.getItem('users')));

    const sectorId = this.activeRoute.snapshot.params['budgsectorid'];

    this.budgetService.getBudgetSector(sectorId, (budgetSector) => {
      this.budgsector = budgetSector
      this.disbursService.getDisbursementNextNumbering((LastNum)=>{
        this.nexDisbursNumber = LastNum;
        this.numregister = this.disbursService.formatRegisterNumberingFormat(LastNum, budgetSector, new Date());
      });
    });

    this.budgetService.getGroupBudgetList((groupedBudget) => {
        this.sortGroupedBudgetSector(sectorId, groupedBudget);
    });

    this.userService.getUserList((data)=>{
      this.users = data; //this.userService.sortUsersByLevel(data, ['000']);
    });
  }

  sortGroupedBudgetSector(currentsectorId:any, groupedBudget: GroupedBudget[]) {
    for(let i of groupedBudget) {
      if (i.budgsectorId==currentsectorId)
        this.groupedBudget.push(i);
    }
  }
  sortIndexByGroupedBudged(form: NgForm) {
    this.budgetIndex =new Array<BudgetIndex>();
    //form.controls['budgetIndex'].reset();
    let groupedBudgetId:any = form.controls['groupbudget'].value
    this.budgetService.getBugdetIndexList((budgetsIndex => {
      for(let i of budgetsIndex) {
        if (i.groupedbudgetId==groupedBudgetId)
          this.budgetIndex.push(i);
      }
    }))
  }

  onDisplayInputBeneficiary(disbursForm: NgForm) {
    this.showInputBeneficiary = !this.showInputBeneficiary;
    this.showSelectedBeneficiary = false;
    if(!this.showInputBeneficiary) {
      this.showSelectBeneficiary = false;
    }
    disbursForm.controls['provider'].reset();
    disbursForm.controls['for'].reset();
  }
  onDisplaySelectBeneficiary(disbursForm:NgForm) {
    //this.showSelectBeneficiary = true;
    this.showSelectedBeneficiary = false;
    disbursForm.controls['for'].reset();

    if (disbursForm.controls['provider'].value!='' && disbursForm.controls['provider'].value!=null ) {
      this.userService.lookForuserbyname(disbursForm.controls['provider'].value, (users:User[])=> {
        this.searchResult = users;
        if (users.length!=0) { this.showSelectBeneficiary = true;
        } else {
          this.showSelectBeneficiary = false;
        }
      });
    } else {
      this.searchResult = this.users;
      this.showSelectBeneficiary = false;
    }
  }
  onDisplaySelectedBeneficiaryField(disbursForm: NgForm) {
    this.showInputBeneficiary = false;
    this.showSelectedBeneficiary = true;
    disbursForm.controls['provider'].reset();
  }

  onReasonSubmit(reasonForm: NgForm) {
    this.disbursService.addDisbursementReason(reasonForm, (reason: ReasonItems)=>{
      this.reasons.push(reason);
      this.cumulateAmount += <number>reason.totalprice;
      if (reason.reasonitemId != null) {
        this.reasonIds.push(reason.reasonitemId);
      }
      reasonForm.resetForm();
    });
  }
  onSubmitDisbursment(disbursForm: NgForm) {
    this.disbursService.getDisbursementNextNumbering((num) => {
      disbursForm.controls['numero'].setValue(num);
      if (disbursForm.value['provider']!=null && disbursForm.value['provider']!='') {
        this.userService.addProviderUser( disbursForm.value['civility'], disbursForm.value['provider'],
          disbursForm.value['mobile'], (p:User)=>{
            disbursForm.controls['for'].setValue(p.userId);
          this.disbursService.addDisbursmentRequest(this.user.userId, disbursForm, this.reasonIds,() => {
            this.router.navigate(['/decaissement/historique']);
          });
        });
      } else {
        this.disbursService.addDisbursmentRequest(this.user.userId, disbursForm, this.reasonIds,() => {
          this.router.navigate(['/decaissement/historique']);
        });
      }
    });
  }

  displayDetailsFields(disbursForm:NgForm, reasonForm:NgForm) {
    this.showDetailsFields = !this.showDetailsFields;
    if(this.showDetailsFields) {
      disbursForm.controls['amount'].reset();
    } else {
      reasonForm.resetForm();
      this.reasons = [];
      this.reasonIds = [];
    }
  }

}
