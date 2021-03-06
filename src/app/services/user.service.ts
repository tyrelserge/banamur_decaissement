import {ResponseInterface, ResponseUser} from "../models/response.interface";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Departement, NotifUser, Office, Profile, User} from "../models/user.model";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {BudgetSecteur} from "../models/budget.model";
import {UtilsResources} from "./utils.resources";

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private router: Router) {

  }

  getUserList(callback: (allUser: User[]) => void) {

    const url = UtilsResources.baseUrl + "/user/all";

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if(data.response==null) return;

          let usersList = data.response;
          let position: number = 0;

          // @ts-ignore
          let self = <User>(JSON.parse(localStorage.getItem('user')));

          for (let user of usersList) {
            if (user.status=='*' || (self.userId!=undefined && self.userId == user.userId)) {
              usersList.splice(position,1);
            }
            position += 1;
          }

          localStorage.setItem('users', JSON.stringify(usersList));
          callback(data.response);
        } else {
          console.error("Aucun utilisateur trouvé");
        }
      },
      error => console.error('There was an error!', error));
  }

  createUser(form: NgForm) {

    let url = UtilsResources.baseUrl + "/user/create";

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

          let userId: number | undefined = data.response.userId;

          localStorage.setItem('user', JSON.stringify(data.response));

          this.getUserList((users) => {

            if (userId==undefined) return;
            let moderators: User[] | undefined = this.sortUsersByLevel(users, ['111', '110']);

            if (moderators==undefined || moderators.length==0) {
              this.setUserStatus(userId, 'active', () => {
                this.sendLocalNotification(userId, 1, '/moderateur/reglage/comptes');
                this.sendLocalNotification(userId, 3, '/moderateur/reglage/comptes');
              });
            } else {
              this.sendLocalNotification(userId, 1, '/moderateur/reglage/comptes');
              this.sendLocalNotification(userId,  2, '/moderateur/reglage/comptes');
              this.getUserFcmToken(userId, token => {
                this.sendAndroidNotification(2, false, token, '/moderateur/reglage/comptes');
              });   // Send recipient notification
            }
            this.sendSignupMail(data.response);
            this.authService.signIn(form.value['email'], form.value['password'], () => {
              this.router.navigate(['/']);
            });
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
  setUserStatus(userId: number | undefined, status: string, callback:(user: User) => void) {

    if (userId==undefined) return;

    let url = UtilsResources.baseUrl + '/user/'+ userId +'/set-status';

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
    const url = UtilsResources.baseUrl + '/user/' + userId ;
    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if(data.response==null) return;
          callback(data.response);
        } else {
          console.error("L'utilisateur semble inexistant");
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

  getProfilesList(callback:(profiles: Profile[]) => void){

    const url = UtilsResources.baseUrl + '/user/profiles';
    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if(data.response==null) return;

        } else {
          console.error("Aucun profil trouvé");
        }
        callback(data.response);
      },
      error => console.error('There was an error!', error));
  }
  getDepartementsList(callback: (departements: Departement[]) => void) {

    const url = UtilsResources.baseUrl + '/user/departments';
    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if(data.response==null) return;

        } else {
          console.error("Aucun département trouvé");
        }
        callback(data.response);
      },
      error => console.error('There was an error!', error));
  }
  getOfficesList(callback: (offices: Office[]) => void) {

    const url = UtilsResources.baseUrl + '/user/offices';
    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {

        } else {
          console.error("Aucune fonction trouvée");
        }
        callback(data.response);
      },
      error => console.error('There was an error!', error));
  }

  getUserProfil() {}
  getDepartement(departmentId: number | undefined, callback: (departement: Departement) => void) {

    const url = UtilsResources.baseUrl + '/user/department/' + departmentId ;
    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if(data.response==null) return;
          callback(data.response);
        } else {
          console.error("Ce département semble inexistant");
        }
      },
      error => console.error('There was an error!', error));
  }
  getUserOffices(userId: number | undefined, callback: (offices: Office[]) => void) {
    this.getUser(userId, (user: User) => {
      callback(user.offices)
    });
  }

  getNotificationMessage(noticeId: number, callback: (message: any) => void) {

    let url = UtilsResources.baseUrl + '/user/notification/message/' + noticeId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode=="SUCCESS") {
          callback(data.response);
        } else {
          console.error('Message not found');
        }
        return false
      },
      error => console.error('There was an error!', error));
  }
  sendLocalNotification(userId: number | undefined, noticeId: number, link: string) {

    const url = UtilsResources.baseUrl + '/user/notify';

    let params = {
      'userId' : userId,
      'notificationId' : noticeId,
      'notificationLink' : link
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url, params,{headers}).subscribe(
      data => {},
      error => console.error('There was an error!', error));

    /*
    if (adminsNoticeId!=0) {
      this.getUserList((users)=>{
        let moderators: User[] | undefined = this.sortUsersByLevel(users, ['111', '110']);
        if (moderators)  for (let moderator of moderators) {
          this.httpClient.post<ResponseInterface>(url,
            {'userId' : moderator.userId, 'notificationId' : adminsNoticeId, 'notificationLink': link},
            {headers}).subscribe(data => {},
            error => console.error('There was an error!', error));
        }
      });   // send to moderators
    }*/
  }
  sendAndroidNotification(noticeId: number, topic: boolean, to: string, link: string) {

    const url = UtilsResources.fcmBaseUrl + '/send';

    if (topic) {
      to = "/topics/" + to;
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': 'key=' + UtilsResources.FCM_SERVER_KEY
    })

    this.getNotificationMessage(noticeId, message => {

        let params = {
          'to': to,
          'notification': {
            'title': message.notificationSubject,
            'body': message.notificationDetails
          }
        }

        this.httpClient.post<ResponseInterface>(url, params,{headers}).subscribe(
          data => {},
          error => console.error('There was an error!', error));
    });
  }

  refrechNotification(userId: number | undefined, callback: (notifs: NotifUser[]) => void) {

    let url = UtilsResources.baseUrl + "/user/notifies/" + userId;

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

    let url = UtilsResources.baseUrl + "/user/notify/opened/" + notificationId;

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

    const url = UtilsResources.baseUrl + '/user/sendmail';

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

  addDepartment(userId: number | undefined, form: NgForm, callback: (department: Departement) => void) {

    let url = UtilsResources.baseUrl + '/user/department/create';

    let params = {
      'userId': userId,
      'departmentName': form.value['name']
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          callback(data.response);
        } else {
          console.error('Verifiez que tous les champs son entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }
  addOffice(userId: number | undefined, form: NgForm, callback: (office:Office) => void) {

    let url = UtilsResources.baseUrl + '/user/office/create';

    let params = {
      'userId': userId,
      'departmentId': form.value['departmentId'],
      'profileId': form.value['profileId'],
      'officeName': form.value['name']
    };

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          let office: Office = data.response;
          this.getUser(userId, (user) => {
            if (user.offices==undefined || user.offices.length==0) {
              this.setUserOffice(userId, [office.officeId], () => {
                localStorage.removeItem('user');
                this.getUser(userId, (user) => {
                  localStorage.setItem('user', JSON.stringify(user));
                });
              });
            }
          })
        } else {
          console.error('Verifiez que tous les champs son entré correctement');
        }
        callback(data.response);
      },
      error => console.error('There was an error!', error));
  }

  setUserOffice(userId: number | undefined, offices: (number | undefined)[], callback: () => void) {

    let url = UtilsResources.baseUrl + '/user/office-set';

    let params = {
      'userId': userId,
      'officeIds': offices
    };

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {

        } else {
          console.error('Verifiez que tous les champs son entré correctement');
        }
        callback();
      },
      error => console.error('There was an error!', error));
  }
  addProviderUser(civility: string, porvider:string, modile:string, callback: (user: User) => void) {

    let url = UtilsResources.baseUrl + "/user/create";

    let providerUserName = porvider.replace(/ /g, "");
    let firstname = porvider.split(' ')[0];
    let lastname: string = "";

    for (let i=1; i < porvider.split(' ').length; i++) {
      lastname += i!=1 ? ' ' : ''
      lastname += porvider.split(' ')[i];
    }

    let providerData = {
      'civility': civility,
      'firstname': firstname,
      'lastname': lastname,
      'officeIds': [],
      'mobile': modile,
      'email': providerUserName+'@',
      'password':'',
      'status': 'provider'
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseUser>(url, providerData, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          callback(data.response);
        }
      },
      error => console.error('There was an error!', error));
  }

  seeNotifications(userId: number | undefined, callback: () => void) {
    const url = UtilsResources.baseUrl + "/user/notify/seen/" + userId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback();
        } else {
          console.error("Aucune notification trouvé");
        }
      },
      error => console.error('There was an error!', error));
  }
  lookForuserbyname(username: string, callback: (users: User[]) => void) {

    const url = UtilsResources.baseUrl + "/user/search/" + username;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if(data.response==null) return;
          callback(data.response);
        } else {
          console.error("Aucun utilisateur trouvé");
        }
      },
      error => console.error('There was an error!', error));
  }

  setPassword(userId: number | undefined, form: NgForm, callback: () => void) {

    let url = UtilsResources.baseUrl + '/user/'+ userId +'/setpassword';

    let params = {
      'pwd': form.value['pwd']
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          alert("Votre mot de passe a été changé avec succes")
          callback();
        } else {
          console.error('Verifier que le champ est entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }

  public getUserFcmToken(userId: number | undefined, callback: (token: string) => void) {

    let url = UtilsResources.baseUrl + '/user/fcm-token/' + userId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode=="SUCCESS") {
          callback(data.response.fcmTokenAccess);
        } else {
          console.error('Token not found');
        }
        return false
      },
      error => console.error('There was an error!', error));
  }

}
