import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {UserService} from "../../../../services/user.service";
import {Router} from "@angular/router";
import {Office, User} from "../../../../models/user.model";

@Component({
  selector: 'app-accounts-setting',
  templateUrl: './accounts-setting.component.html',
  styleUrls: ['./accounts-setting.component.css']
})
export class AccountsSettingComponent implements OnInit {

  isModerator: boolean | undefined;
  self: User = new User();
  myOffices: Office[] = new Array<Office>();

  AllUsers: User[] = new Array<User>();
  pendingAccount: User[] = new Array<User>();
  activeAccount: User[] = new Array<User>();
  disabledAccount: User[] = new Array<User>();
  deletedAccount: User[] = new Array<User>();


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

    this.refreshAcountesStatus();
  }

  activateAccount(userId: number | undefined) {
    this.userService.setUserStatus(userId, 'active', ()=>{
      this.userService.sendNotification(userId,3,0, '/');
      this.refreshAcountesStatus();
    });
  }

  deactivateAccount(userId: number | undefined) {
    this.userService.setUserStatus(userId, 'disabled', ()=>{
      this.refreshAcountesStatus();
    });
  }

  deleteAccount(userId: number | undefined) {
    this.userService.setUserStatus(userId, 'deleted', ()=>{
      this.refreshAcountesStatus();
    });
  }

  private refreshAcountesStatus() {
    this.userService.getUserList((users) => {
      this.AllUsers = users;

      this.pendingAccount = new Array<User>();
      this.activeAccount = new Array<User>();
      this.disabledAccount = new Array<User>();
      this.deletedAccount = new Array<User>();

      for(let user of users) {

        if ((user.status==null || user.status==undefined) && this.self.userId!=user.userId)
          this.pendingAccount.push(user);

        if (user.status=='active' && this.self.userId!=user.userId)
            this.activeAccount.push(user);

        if (user.status=='disabled' && this.self.userId!=user.userId)
          this.disabledAccount.push(user);

        if (user.status=='deleted' && this.self.userId!=user.userId)
          this.deletedAccount.push(user);
      }

    });
  }
}
