import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../services/user.service";
import {Departement, Office, Profile, User} from "../../../../models/user.model";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-department-setting',
  templateUrl: './department-setting.component.html',
  styleUrls: ['./department-setting.component.css']
})
export class DepartmentSettingComponent implements OnInit {

  user: User = new User();

  profiles: Profile[] = new Array<Profile>();
  departments: Departement[] = new Array<Departement>();
  offices: Office[] = new Array<Office>();

  isModerator: boolean | undefined;

  constructor(private authService: AuthService,
              private router: Router, private userService: UserService) { }

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

    // @ts-ignore
    this.user = <User>(JSON.parse(localStorage.getItem('user')));

    this.userService.getDepartementsList((departments) => {
      this.departments = departments;
    });

    this.userService.getProfilesList((profiles) => {
      this.userService.getOfficesList((offices) => {
        if(offices==undefined || offices==[]) {
          for (let profile of profiles) {
            if (profile.profileLevel==='111') this.profiles.push(profile);
          }
        } else {
          this.profiles = profiles;
        }
        this.offices = offices;
      });
    });
    //this.userService.setUserOffice(2, [1], ()=>{});
  }

  onSubmitDepartment(departmentForm: NgForm) {
    this.userService.addDepartment(this.user.userId, departmentForm, () => {
      this.userService.getDepartementsList((departments) => {
        this.departments = departments;
      });
    });
  }
  onSubmitOffice(officeForm: NgForm) {
    this.userService.addOffice(this.user.userId, officeForm, (office) => {
      this.userService.getOfficesList((offices) => {
        this.offices = offices;
        this.userService.getProfilesList((profiles) => {
          this.userService.getOfficesList((offices) => {
            if(offices==undefined || offices==[]) {
              for (let profile of profiles) {
                if (profile.profileLevel==='111') this.profiles.push(profile);
              }
            } else {
              this.profiles = profiles;
            }
            this.offices = offices;
          });
        });
      });
    })
  }
}
