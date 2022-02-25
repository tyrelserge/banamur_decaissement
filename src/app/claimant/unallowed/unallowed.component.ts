import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-unallowed',
  templateUrl: './unallowed.component.html',
  styleUrls: ['./unallowed.component.css']
})
export class UnallowedComponent implements OnInit {

  constructor(private authService: AuthService,
              private router:Router,
              private userService: UserService) { }

  ngOnInit(): void {
    if (this.authService.isAuth()) {
      if (this.authService.isAllowed()) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  onSendSignupMail() {
    if (this.authService.isAuth()) {
      // @ts-ignore
      let user = <User>(JSON.parse(localStorage.getItem('user')));
      this.userService.sendSignupMail(user);
    }
  }

}
