import {ResponseInterface, ResponseUser} from "../models/response.interface";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Departement, NotifUser, Office, Profile, User} from "../models/user.model";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private router: Router) {

  }

  createUser(form: NgForm) {

    let url = "http://localhost:8080/decaissement-api-0.0.1/user/create";

    let params = {
      'civility': form.value['civility'],
      'firstname': form.value['firstname'],
      'lastname': form.value['lastname'],
      'officeIds': form.value['office']=='' ? [] : [ form.value['office'] ],
      'mobile': form.value['mobile'],
      'email': form.value['email'],
      'password': form.value['password']
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseUser>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {

          if (data.response.userId==undefined)
            return;

          let userId: number = data.response.userId;

          this.getUserList((users) => {

            let moderators: User[] | undefined = this.sortUsersByLevel(users, ['111', '110']);
            console.log(moderators)
            if (moderators==undefined || moderators.length==0) {
              this.setUserStatus(userId, 'active', () => {
                this.sendNotification(userId, 1, 0);
                this.sendNotification(userId, 3, 0);
                this.authService.signIn(form.value['email'], form.value['password'], '/');
              });
            } else {
              this.sendNotification(userId, 1, 2);
              this.authService.signIn(form.value['email'], form.value['password'], '/');
            }
            this.sendSignupMail(data.response);
          });

        } else if (data.statusCode=='ALREADY_EXISTS') {

          alert('Cette adresse e-mail est déjà enregistré');
          this.router.navigate(['/']);

        } else {
          alert('Verifiez que tous les champs son entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }

  setUserStatus(userId: number, status: string, callback:(user: User) => void) {

    let url = 'http://localhost:8080/decaissement-api-0.0.1/user/'+ userId +'/set-status';

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.put<ResponseUser>(url, {'status': status}, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          callback(data.response);
        } else {
          console.error('Une erreur s\'est produite');
        }
      },
      error => console.error('There was an error!', error));
  }
  getUser(userId: number | undefined, callback: (user: User) => void) {
    const url = 'http://localhost:8080/decaissement-api-0.0.1/user/' + userId ;
    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if(data.response==null) return;
          callback(data.response);
        } else {
          console.error("Une erreur s'est produite");
        }
      },
      error => console.error('There was an error!', error));
  }
  getUserProfil() {}

  getUserList(callback: (allUser: User[]) => void) {
    const url = "http://localhost:8080/decaissement-api-0.0.1/user/all";
    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if(data.response==null) return;
          localStorage.setItem('users', JSON.stringify(data.response));
          callback(data.response);
        } else {
          console.error("Une erreur s'est produite");
        }
      },
      error => console.error('There was an error!', error));
  }
  sortUsersByLevel(users:User[], level:string[]) {
    if(!users) return;
    let user = new Array<User>();
    for(let i=0; i <= users.length; i++) {
      let office:Office[] | undefined;

      if (users[i]) {
        office = users[i].offices;

        if (office) {
          for (let j = 0; j <= office.length; j++) {
            let profile: Profile | undefined;

            if (office[j]) {
              profile = office[j].profile

              if(profile) {
                for (let l of level) {
                  if(profile.profileLevel===l) user.push(users[i]);
                }
              }
            }
          }
        }
      }
    }
    return user;
  }

  getUserOffices(userId: number | undefined, callback: (offices: Office[]) => void) {
    this.getUser(userId, (user: User) => {
      callback(user.offices)
    });
  }
  getDepartement(departmentId: number | undefined, callback: (departement: Departement) => void) {

    const url = 'http://localhost:8080/decaissement-api-0.0.1/user/department/' + departmentId ;
    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if(data.response==null) return;
          callback(data.response);
        } else {
          console.error("Une erreur s'est produite");
        }
      },
      error => console.error('There was an error!', error));
  }

  sendNotification(userId: number | undefined, userNoticeId: number, adminsNoticeId: number) {

    const url = 'http://localhost:8080/decaissement-api-0.0.1/user/notify';

    let params = {
      'userId' : userId,
      'notificationId' : userNoticeId
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url,
      {'userId': userId, 'notificationId': userNoticeId},
      {headers}).subscribe( data => {},
      error => console.error('There was an error!', error));

    if (adminsNoticeId!=0) {
      this.getUserList((users)=>{
        let moderators: User[] | undefined = this.sortUsersByLevel(users, ['111', '110']);
        if (moderators)  for (let moderator of moderators) {
        this.httpClient.post<ResponseInterface>(url,
          {'userId' : moderator.userId, 'notificationId' : adminsNoticeId},
          {headers}).subscribe(data => {},
          error => console.error('There was an error!', error));
        }
      });   // send to moderators
    }
  }
  refrechNotification(userId: number | undefined, callback: (notifs: NotifUser[]) => void) {

    let url = "http://localhost:8080/decaissement-api-0.0.1/user/notifies/" + userId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode=="SUCCESS") {
          callback(data.response);
        } else {
          console.error('unknow error');
        }
      },
      error => console.error('There was an error!', error));
  }
  goToNotificationLink(notificationId: number | undefined, callback: (userId:number) => void) {

    let url = "http://localhost:8080/decaissement-api-0.0.1/user/notify/opened/" + notificationId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode=="SUCCESS") {
          callback(data.response.userId);
        } else {
          console.error('unknow error');
        }
        return false
      },
      error => console.error('There was an error!', error));
  }

  sendSignupMail(user: User) {

    return;

    const url = 'http://localhost:8080/decaissement-api-0.0.1/user/sendmail';

    let params = {
      'address' : user.email,
      'subject' : "Confirmation de compte",
      'content' : "Ceci est un e-mail de confirmation pour nouvel utilisateur." +
        "Une nouvelle demande de validation de compte vient de vous être envoyé, " +
        "Veuillez cliquer sur le lien suivant pour acceder au paramètres de compte utilisateur." +
        "http://localhost:4200/moderateur/account-verification"
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {

        } else {
          console.error("Il s'est produit une erreur à l'envoi du e-mail de confirmation");
        }
      },
      error => console.error('There was an error!', error));
  }
  sendDisbursmentMail(data: any) {

  }
  sendValidationMail(response: any) {
    
  }

}
