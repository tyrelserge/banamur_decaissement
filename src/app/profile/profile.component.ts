import { Component, OnInit } from '@angular/core';
import {Office, User} from "../models/user.model";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isModerator: boolean | undefined;
  self: User = new User();
  myOffices: Office[] = new Array<Office>();

  users: User[] = new Array<User>();

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.isModerator = this.authService.isModerator();

    if (!this.isModerator)
      this.userService.getUserList((users) => {
        let moderators: User[] | undefined = this.userService.sortUsersByLevel(users, ['111', '110']);
        if (moderators == undefined || moderators.length == 0)
          this.isModerator = true;
      });

    // @ts-ignore
    this.self = <User> JSON.parse(localStorage.getItem('user'));
    if (this.self.offices.length!=0) {
      for (let office of this.self.offices) {
        this.myOffices.push(office);
      }
    }

    this.userService.getUserList((users) => {
      this.users = users;
    });
  }
}
