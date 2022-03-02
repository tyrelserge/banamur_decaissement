import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-resources-setting',
  templateUrl: './resources-setting.component.html',
  styleUrls: ['./resources-setting.component.css']
})
export class ResourcesSettingComponent implements OnInit {

  isModerator: boolean | undefined;

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.isModerator = this.authService.isModerator();

    if (!this.isModerator)
      this.userService.getUserList((users) => {
        let moderators: User[] | undefined = this.userService.sortUsersByLevel(users, ['111', '110']);
        if (moderators == undefined || moderators.length == 0) {
          this.isModerator = true;
        } else {
          this.router.navigate(['/']);
        }
      });

  }

}
