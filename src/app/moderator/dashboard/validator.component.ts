import { Component, OnInit } from '@angular/core';
import {Disbursement} from "../../../models/disburs.model";
import {AuthService} from "../../../services/auth.service";
import {DisbursService} from "../../../services/disburs.service";
import {User} from "../../../models/user.model";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css']
})
export class ValidatorComponent implements OnInit {

  disbursements: Disbursement[] = new Array<Disbursement>();
  countPending: number = 0;

  isModerator: boolean | undefined;

  constructor(private router: Router,
              private authService: AuthService,
              private disbursService: DisbursService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.isModerator = this.authService.isModerator();

    if (!this.isModerator) {
      this.userService.getUserList((users) => {
        let moderators: User[] | undefined = this.userService.sortUsersByLevel(users, ['111', '110']);
        if (moderators == undefined || moderators.length == 0) {
          this.isModerator = true;
        } else {
          this.router.navigate(['/decaissement']);
        }
      });
    } else {
      this.router.navigate(['/moderateur/pending-requetes']);          // A supprimer quand le dashbord sera prête
    }
    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));
    this.disbursService.getPendingDisbursements((data) => {
      for(let i of data) {
        this.disbursements.push(i)
        this.countPending += 1;
      }
    })
  }

}
