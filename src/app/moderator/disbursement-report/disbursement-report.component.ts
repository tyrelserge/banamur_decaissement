import { Component, OnInit } from '@angular/core';
import {BudgetSecteur} from "../../../models/budget.model";
import {DisbursRapport} from "../../../models/disburs.model";
import {User} from "../../../models/user.model";
import {AuthService} from "../../../services/auth.service";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {DisbursService} from "../../../services/disburs.service";
import {BudgetService} from "../../../services/budget.service";
import {NgForm} from "@angular/forms";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-disbursement-report',
  templateUrl: './disbursement-report.component.html',
  styleUrls: ['./disbursement-report.component.css']
})
export class DisbursementReportComponent implements OnInit {

  budgetSectors: BudgetSecteur[] = new Array<BudgetSecteur>();
  disbursRapport: DisbursRapport[] = new Array<DisbursRapport>();

  user: User = new User();
  users: User[] = new Array<User>();

  today = new Date();

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private disbursService: DisbursService,
              private budgetService: BudgetService,
              private datepipe: DatePipe) { }

  ngOnInit(): void {
    if (!this.authService.isModerator()) this.router.navigate(['/']);

    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));

    this.userService.getUserList((users:User[]) => {
      this.users = users;
    })

    this.budgetService.getBudgetSectorList(budgetSectors =>{
      this.budgetSectors = budgetSectors
    })

    this.disbursService.getDisbursementRapportByPeriod(undefined, (disbursRapport: DisbursRapport[]) => {
      this.disbursRapport = disbursRapport;
    });
  }

  onsubmitDisburReportFetch(form: NgForm) {
    this.disbursRapport = new Array<DisbursRapport>();
    this.disbursService.getDisbursementRapportByPeriod(form, (disbursRapport: DisbursRapport[]) => {
      this.disbursRapport = disbursRapport;
    });
  }

  onExportToExcel(form: NgForm) {
    this.disbursService.exportDisbursementRapportByPeriod(form).subscribe((response) => {

      const blob = new Blob([response], {type:'application/vnd/ms-excel'});
      const data = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = data;
      link.download = 'Rapport-'+ this.user.lastname +'-'+ this.datepipe.transform(new Date(), 'dd-MM-yyyy') +'.xlsx';
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);

    });
  }

  processingChecked(disb: DisbursRapport) {
    return disb.status!='rejected' && disb.amountApproved=='null';
  }

}
