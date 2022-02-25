import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {BudgetIndex, BudgetSecteur} from "../../../../models/budget.model";
import {NgForm} from "@angular/forms";
import {BudgetService} from "../../../../services/budget.service";
import {NotifUser, User} from "../../../../models/user.model";
import {UserService} from "../../../../services/user.service";
import {DisbursService} from "../../../../services/disburs.service";
import {NavbarComponent} from "../../../navbar/navbar.component";

@Component({
  selector: 'app-disbursement',
  templateUrl: './disbursement.component.html',
  styleUrls: ['./disbursement.component.css']
})
export class DisbursementComponent implements OnInit {

  today = new Date();

  user:User = new User();
  users:User[] | undefined = new Array<User>();

  budgsector:BudgetSecteur = new BudgetSecteur();
  budgetIndex: BudgetIndex[] = new Array<BudgetIndex>();

  numregister: string | undefined;
  showSelectBeneficiary: boolean = false;
  cumulateAmount: number | undefined;

  constructor(private authService: AuthService,
              private activeRoute: ActivatedRoute,
              private httpClient: HttpClient,
              private router: Router,
              private budgetService: BudgetService,
              private userService:UserService,
              private disbursService: DisbursService) {
  }

  ngOnInit(): void {
    if (!this.authService.isAuth()) return;
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
      this.users = this.userService.sortUsersByLevel(data, ['000']);
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

  onDisplaySelectBeneficiary() {
    this.showSelectBeneficiary = !this.showSelectBeneficiary;
  }

  cumulativeAmount() {
    this.cumulateAmount = 0;
  }

  onSubmitDisbursment(disbursForm: NgForm) {
    this.disbursService.addDisbursmentRequest(this.user.userId, disbursForm, () => {
      this.router.navigate(['/decaissement/historique']);
    });
  }

}
