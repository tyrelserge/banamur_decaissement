import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {BudgetIndex, BudgetSecteur} from "../../../../models/budget.model";
import {NgForm} from "@angular/forms";
import {BudgetService} from "../../../../services/budget.service";
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../services/user.service";
import {DisbursService} from "../../../../services/disburs.service";
import {ReasonItems} from "../../../../models/disburs.model";

@Component({
  selector: 'app-disbursement',
  templateUrl: './disbursement.component.html',
  styleUrls: ['./disbursement.component.css']
})
export class DisbursementComponent implements OnInit {

  today = new Date();

  user:User = new User();
  users:User[] = new Array<User>();

  budgsector:BudgetSecteur = new BudgetSecteur();
  budgetIndex: BudgetIndex[] = new Array<BudgetIndex>();

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

    const id = this.activeRoute.snapshot.params['budgsectorid'];
    this.numregister = this.numberingIndex(id) + '-' + '001';
    this.budgetService.getSelectedSector(id, (data) => {
      this.budgsector = data
    });
    this.budgetService.getBugdetIndexList((data) => this.hydrateBudgetIndex(data));
    this.userService.getUserList((data)=>{
      this.users = data; //this.userService.sortUsersByLevel(data, ['000']);
    });
  }

  hydrateBudgetIndex(_budgetIndex: BudgetIndex) {
    // @ts-ignore
    for(let i of _budgetIndex) {
      this.budgetIndex.push(i)
    }
  }

  numberingIndex(id: any) {
    switch (id) {
      case '1': return 'A';
        break;
      case '2': return 'B';
        break;
      case '3': return 'C';
        break;
      default: return '';
        break;
    }
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
    this.showSelectBeneficiary = true;
    this.showSelectedBeneficiary = false;
    disbursForm.controls['for'].reset();

    if (disbursForm.controls['provider'].value!='' && disbursForm.controls['provider'].value!=null ) {
      this.userService.lookForuserbyname(disbursForm.controls['provider'].value, (users:User[])=> {
      this.searchResult = users;
    });
    } else {
      this.searchResult = this.users;
    }
  }

  onDisplaySelectedBeneficiaryField(disbursForm: NgForm) {
    this.showInputBeneficiary = false;
    this.showSelectedBeneficiary = true;
    disbursForm.controls['provider'].reset();
  }

  cumulativeAmount() {

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
    if (disbursForm.value['provider']!=null && disbursForm.value['provider']!='') {
      this.userService.addProviderUser(disbursForm.value['civility'], disbursForm.value['provider'], disbursForm.value['mobile'], (user:User)=>{
        disbursForm.controls['for'].setValue(user.userId);
        console.log(disbursForm.value);
        this.disbursService.addDisbursmentRequest(this.user.userId, disbursForm, this.reasonIds,() => {
          this.router.navigate(['/decaissement/historique']);
        });
      });
    } else {
      this.disbursService.addDisbursmentRequest(this.user.userId, disbursForm, this.reasonIds,() => {
        this.router.navigate(['/decaissement/historique']);
      });
    }
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
