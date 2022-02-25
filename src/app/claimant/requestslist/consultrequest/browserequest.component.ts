import { Component, OnInit } from '@angular/core';
import {Disbursement} from "../../../../models/disburs.model";
import {DisbursService} from "../../../../services/disburs.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-browserequest',
  templateUrl: './browserequest.component.html',
  styleUrls: ['./browserequest.component.css']
})
export class BrowserequestComponent implements OnInit {

  disbursement: Disbursement = new Disbursement();
  validationChain: any[] = new Array<Object>();

  constructor(private activeRoute: ActivatedRoute, private disbursService: DisbursService) { }

  ngOnInit(): void {
    const disbursId = this.activeRoute.snapshot.params['disbursid'];
    this.disbursService.getDisbursementRequest(disbursId, (data) => {
      this.disbursement = data;
      this.disbursService.loadValidationChain(data.validations, (data) => {
        this.validationChain = data;
      });
    });
  }

}
