import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseUser} from "../models/response.interface";
import {Router} from "@angular/router";
import {Office, Profile, User} from "../models/user.model";
import {UserService} from "./user.service";

@Injectable()
export class AuthService {

  constructor(private router: Router, private httpClient: HttpClient) {}

  isAuth() {
    let user = localStorage.getItem('user');
    if (user!=null) {
      return true;
    }
    return false;
  }
  isAllowed() {
    if (this.isAuth()) {
      // @ts-ignore
      let user = <User>(JSON.parse(localStorage.getItem('user')));
      if (user!= undefined && (user.status=="*" || user.status=="active")) {
        return true;
      }
    }
    return false;
  }

  isAdmin() {
    // @ts-ignore
    let user: User = <User>(JSON.parse(localStorage.getItem('user')));
    return this.checkUserLevel(user, '111');
  }
  isModerator() {
    // @ts-ignore
    let user: User = <User>(JSON.parse(localStorage.getItem('user')));
    return (this.checkUserLevel(user, '111') || this.checkUserLevel(user, '110'));
  }

  checkUserLevel(user: User, level: string) {
    if (user) {
      let office: Office[] = user.offices;

      if (office) {
        for (let j = 0; j <= office.length; j++) {
          let profile: Profile | undefined;

          if (office[j]) {
            profile = office[j].profile

            if(profile) {
              if(profile.profileLevel===level) return true
            }
          }
        }
      }
    }
    return false
  }

  signIn(username:string, password:string, callback: (user:User) => void) {

    const url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/user/login';

    let params = {
      'username' : username,
      'password' : password
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseUser>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          localStorage.setItem('user', JSON.stringify(data.response));
        } else {
          alert("Login ou mot passe Incorrect");
        }
        callback(data.response);
      },
      error => console.error('There was an error!', error));
  }
  signOut() {
    localStorage.clear();
  }

  signInById(userId: number, password: string, redirectTo:string | null) {

    const url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/user/'+userId;

    this.httpClient.get<ResponseUser>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if (data.response.email!=null)
            this.signIn(data.response.email, password, () => {
              this.router.navigate(['/']);
            });
        } else {
          alert("Erreur de création du mot de passe");
          alert('Verifiez que tous les champs son entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }

  setPassword(userId:number, oldPassword:string, newPassword:string, redirectTo:string | null) {

    const url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/user/'+userId+'/setpassword';

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseUser>(url, {'oldPwd':oldPassword, 'pwd': newPassword}, {headers}).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          this.signInById(userId, newPassword, redirectTo);
        } else {
          console.error("Une erreur s'est produite");
        }
      },
      error => console.error('There was an error!', error));
  }


}
