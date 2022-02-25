import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseUser} from "../models/response.interface";
import {Router} from "@angular/router";
import {User} from "../models/user.model";

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

  signIn(username:string, password:string, redirectTo: string | null) {

    const url = 'http://localhost:8080/decaissement-api-0.0.1/user/login';

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
          if (redirectTo!=null) {
            this.router.navigate([redirectTo]);
          }
        } else {
          alert("Login ou mot passe Incorrect");
        }
      },
      error => console.error('There was an error!', error));
  }
  signOut() {
    localStorage.clear();
  }

  signInById(userId: number, password: string, redirectTo:string | null) {

    const url = 'http://localhost:8080/decaissement-api-0.0.1/user/'+userId;

    this.httpClient.get<ResponseUser>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if (data.response.email!=null)
            this.signIn(data.response.email, password, redirectTo);
        } else {
          alert("Erreur de création du mot de passe");
          alert('Verifiez que tous les champs son entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }

  setPassword(userId:number, oldPassword:string, newPassword:string, redirectTo:string | null) {

    const url = 'http://localhost:8080/decaissement-api-0.0.1/user/'+userId+'/setpassword';

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
