import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {User, NotifUser} from "../../models/user.model";
import {ResponseInterface} from "../../models/response.interface";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  userNotfs: NotifUser[] | undefined;

  moderator: User[] | undefined = new Array<User>();

  showNotice: boolean = false;
  switchMode: boolean = false;
  showSettings: boolean = false;

  constructor(private authService: AuthService, private router: Router,
              private httpClient: HttpClient,
              private userService: UserService) {
  }

  ngOnInit(): void {
    if (!this.authService.isAuth()) return;
      // @ts-ignore
      this.user = <User>(JSON.parse(localStorage.getItem('user')));
      this.userService.getUserList((data)=>{
        this.moderator = this.userService.sortUsersByLevel(data, ['111', '110']);
      });
      this.loadUserNotification(this.user.userId);
  }

  onSignOut() {
    this.authService.signOut();
    this.router.navigate(['/connexion']);
  }

  loadUserNotification(userId: number | undefined) {
    this.userService.refrechNotification(userId, (data) => {
      this.userNotfs = data;
    });
  }
  countNotif(userNotfs: NotifUser[]) {

    let count = 0;
    let i = 0;

    if (userNotfs==undefined)
      return count;

    while(i <= userNotfs.length) {
      if(userNotfs[i] && userNotfs[i].notificationOpened==null) count += 1;
      i++;
    }

    return count;
  }
  onOpenNotification(notificationId: number | undefined, redirectTo:string | undefined) {
    this.userService.goToNotificationLink(notificationId, (userId) => {
      this.onDisplayNotice();
      this.loadUserNotification(userId);
    });
    if (redirectTo!=undefined) this.router.navigate([redirectTo]);
  }

  onDisplayNotice() {
    this.showNotice = !this.showNotice;
    if (this.showSettings==true) this.showSettings = !this.showSettings;
    if(this.switchMode==true) this.switchMode = !this.switchMode;
  }
  onDisplaySettings() {
    this.showSettings = !this.showSettings;
    if (this.showNotice==true) this.showNotice = !this.showNotice;
    if(this.switchMode==true) this.switchMode = !this.switchMode;
  }
  onDisplayMode() {
    this.switchMode = !this.switchMode;
    if (this.showSettings==true) this.showSettings = !this.showSettings;
    if (this.showNotice==true) this.showNotice = !this.showNotice;
  }

}
