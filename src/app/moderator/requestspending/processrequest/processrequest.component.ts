import { Component, OnInit } from '@angular/core';
import {BudgetIndex, BudgetSecteur} from "../../../../models/budget.model";
import {User} from "../../../../models/user.model";
import {AuthService} from "../../../../services/auth.service";
import {BudgetService} from "../../../../services/budget.service";
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DisbursService} from "../../../../services/disburs.service";
import {Disbursement} from "../../../../models/disburs.model";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-processrequest',
  templateUrl: './processrequest.component.html',
  styleUrls: ['./processrequest.component.css']
})
export class ProcessrequestComponent implements OnInit {

  user:User = new User();
  claimant: User = new User();
  recipient: User = new User();

  disbursement: Disbursement = new Disbursement();
  budgetIndex: BudgetIndex = new BudgetIndex();
  budgetSector:BudgetSecteur = new BudgetSecteur();
  valid: boolean = true;
  paynow:boolean = false;

  constructor(private authService: AuthService,
              private activeRoute: ActivatedRoute,
              private disbursService: DisbursService,
              private budgetService: BudgetService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isModerator()) this.router.navigate(['/']);

    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));
    const id = this.activeRoute.snapshot.params['disbursid'];
    this.disbursService.getDisbursementRequest(id, (disburs) => {
      this.disbursement = disburs;
      this.disbursService.treatedValidation(this.user.userId, [disburs], (treated) => {
        if ((disburs.status=='treated' || disburs.status=='rejected') || treated)
          this.router.navigate(['moderateur/requete/'+this.disbursement.debursementId])
      });
      this.budgetService.getBugdetIndex(disburs.budgindexId, (index) =>{
        this.budgetIndex = index;
        this.budgetService.getBudgetSector(index.budgsectorId, (sector) => {
          this.budgetSector = sector;
        });
      })
      this.userService.getUser(disburs.userId, (claimant) => {
        this.claimant = claimant;
      })
      this.userService.getUser(disburs.recipientId, (recipient) => {
        this.recipient = recipient;
      })
    });
  }

  onSubmitValidation(disbursement: Disbursement, valForm: NgForm) {
    this.disbursService.setValidationDisbursement(this.user.userId, disbursement, valForm,()=>{
        this.router.navigate(['/moderateur/requetes']);
    });
  }

  onValidationCheck() {
    this.valid = !this.valid;
  }

  onPayNowChecked() {
    this.paynow = !this.paynow;
  }
}
