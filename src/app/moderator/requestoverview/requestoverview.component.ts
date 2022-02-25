import { Component, OnInit } from '@angular/core';
import {Disbursement, ValidationAction} from "../../../models/disburs.model";
import {ActivatedRoute} from "@angular/router";
import {DisbursService} from "../../../services/disburs.service";
import {UserService} from "../../../services/user.service";
import {Departement, Office, User} from "../../../models/user.model";

@Component({
  selector: 'app-requestoverview',
  templateUrl: './requestoverview.component.html',
  styleUrls: ['./requestoverview.component.css']
})
export class RequestoverviewComponent implements OnInit {

  disbursement: Disbursement = new Disbursement();
  validations: ValidationAction[] = new Array<ValidationAction>();

  validationChain: any[] = new Array<Object>();

  limitStep: number = 3;

  constructor(private activeRoute: ActivatedRoute,
              private disbursService: DisbursService,
              private userService: UserService) { }

  ngOnInit(): void {

    const disbursId = this.activeRoute.snapshot.params['disbursid'];
    this.disbursService.getDisbursementRequest(disbursId, (disbursement) => {
      this.disbursement = disbursement;
      this.validations = disbursement.validations;
      // this.userService.getUser(disbursement.validations)
      this.disbursService.loadValidationChain(disbursement.validations, (data) => {
        this.validationChain = data;
      });
    });
  }

}
