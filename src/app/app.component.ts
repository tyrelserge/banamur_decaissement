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

  private sessionTimer: number | any;

  user: User = new User();
  users: User[] | undefined = new Array<User>();
  moderator: User[] | undefined = new Array<User>();

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {

      window.onload = () => { this.sessionTimer = 0; };
      window.onclick = () => { this.sessionTimer = 0; };
      window.onkeydown = () => { this.sessionTimer = 0; };
      window.onscroll = () => { this.sessionTimer = 0; };
    //window.onmousemove = () => { this.sessionTimer = 0; };
    //window.onmousedown = () => { this.sessionTimer = 0; };

      let self = this;

      (function checkUpdate() {
        self.sessionTimer++

        if (self.sessionTimer >= 3*60) {
          self.authService.signOut();
        }

        setTimeout(() => {
          checkUpdate();
        }, 2000);
      }) ();

  }


}
