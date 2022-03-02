import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {DisbursService} from "../services/disburs.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Banamur Decaissement';

  user: User = new User();
  users: User[] | undefined = new Array<User>();
  moderator: User[] | undefined = new Array<User>();

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {

  }

}
