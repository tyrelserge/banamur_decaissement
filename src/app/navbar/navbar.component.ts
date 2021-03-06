import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {User, NotifUser} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";
import {SwUpdate} from "@angular/service-worker";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User = new User;
  userNotfs: NotifUser[] | undefined;

  isModerator: boolean = false;

  showNotice: boolean = false;
  switchMode: boolean = false;
  showSettings: boolean = false;

  updateAvailable: boolean = false;

  constructor(private authService: AuthService, private router: Router,
              private httpClient: HttpClient,
              private userService: UserService,
              private update: SwUpdate) {
  }

  ngOnInit(): void {

    if (this.update.isEnabled) {
      this.update.available.subscribe(() => {
        this.updateAvailable = true;
      });
    }

    this.isModerator = this.authService.isModerator();
    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));
    this.loadUserNotification(this.user.userId);
  }

  doUpdate() {
    this.updateAvailable = false;
    window.location.reload();
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
      if(userNotfs[i] && userNotfs[i].notificationOpened==null && userNotfs[i].notificationSeen==null) count += 1;
      i++;
    }

    return count;
  }
  onOpenNotification(notificationId: number | undefined, redirectTo:string | undefined) {
    this.userService.goToNotificationLink(notificationId, (userId) => {
      this.loadUserNotification(userId);
      if (redirectTo!=undefined) this.router.navigate([redirectTo]);
    });
  }

  onDisplayNotice() {

    this.showNotice = !this.showNotice;
    if (this.showSettings==true) this.showSettings = !this.showSettings;
    if(this.switchMode==true) this.switchMode = !this.switchMode;

    this.userService.seeNotifications(this.user.userId, () => {})
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
