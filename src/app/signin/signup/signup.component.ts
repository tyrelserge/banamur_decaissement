import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Office, Profile, User} from "../../models/user.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseInterface, ResponseUser} from "../../models/response.interface";
import {NgForm} from "@angular/forms";
import {UserService} from "../../services/user.service";

declare const signinScreen: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isAuth: boolean | undefined;
  offices: Office[] | undefined;

  constructor(private router: Router,
              private authService: AuthService,
              private httpClient: HttpClient,
              private userService: UserService) {
  }

  ngOnInit(): void {

    signinScreen();

    this.isAuth = this.authService.isAuth();
    if (this.isAuth) this.router.navigate(['/unallowed']);
    this.userService.getOfficesList((offices) => {
      this.offices = offices
    });
  }

  onSubmitSignup(form: NgForm) {
    this.userService.createUser(form);
  }

}
