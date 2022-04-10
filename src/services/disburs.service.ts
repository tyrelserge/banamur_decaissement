import {Injectable} from "@angular/core";
import {NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseInterface} from "../models/response.interface";
import {UserService} from "./user.service";
import {Disbursement, DisbursRapport, ReasonItems, ValidationAction} from "../models/disburs.model";
import {Router} from "@angular/router";
import {DatePipe, formatDate} from "@angular/common";
import {Observable} from "rxjs";
import {BudgetSecteur} from "../models/budget.model";
import {UtilsResources} from "./utils.resources";
import {User} from "../models/user.model";

@Injectable()
export class DisbursService {

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private router: Router,
              private datepipe: DatePipe) {}


  getDisbursementNextNumbering(callback: (num:string) => void) {

    let url = UtilsResources.baseUrl + "/disbusement/registration/nextnumber";

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback(data.response);
        } else {
          console.error("Ce probleme de recupération de données");
        }
      },
      error => {
        console.error('There was an error!', error)
      });
  }

  formatRegisterNumberingFormat(num: string | undefined, budgetSector: BudgetSecteur, date: Date) {
    return '' + formatDate(date, 'yyMM', 'en_US') + '/' + budgetSector.budgsectorChar + num;
  }

  addDisbursmentRequest(userId:number | undefined, form: NgForm, reasonIds:number[], callback: (response: Disbursement) => void) {

    let url = UtilsResources.baseUrl + '/disbusement/request';

    let recipient = userId;

    if (form.value['for']!=null && form.value['for']!="") {

      if (form.value['for'][0]!=null && form.value['for'][0]!="") {
        recipient = form.value['for'][0];
      } else {
        recipient = form.value['for'];
      }
    } else {
      recipient = userId;
    }

    let params = {
      'budgindexId': form.value['budgetIndex'],
      'userId': userId,
      'recipientId': recipient,
      'identifier': form.value['numero'],
      'reason': form.value['reason'],
      'amountRequested': form.value['totalamount'],
      'status': 'submitted',
      'reasonItemsIds': reasonIds
    };

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          this.userService.sendDisbursmentMail(data.response);
          this.userService.sendLocalNotification(data.response.userId, 4, '/decaissement/historique');
          this.userService.getUserFcmToken(data.response.userId, token => {
            this.userService.sendAndroidNotification(4, false, token, '/decaissement/historique');
          });   // Send recipient notification
          this.userService.sendAndroidNotification(5, true, 'AdminOnly','/decaissement/historique');
          this.userService.getUserList((users) => {
            let admins: User[] | undefined = this.userService.sortUsersByLevel(users, ['111']);
            if (admins)  for (let admin of admins) {
              this.userService.sendLocalNotification(admin.userId, 5, '/moderateur/requetes');
            }
          });   // send local notice to moderators
          callback(data.response);
        } else if (data.statusCode=='ALREADY_EXISTS') {
          console.error('Un erreur s\'est produite');
        } else {
          console.error('Verifiez que tous les champs son entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }
  addDisbursementReason(form: NgForm, callback: (reason: ReasonItems) => void) {

    let url = UtilsResources.baseUrl + '/disbusement/request/reason';

    let designation = form.value['unity']!=null ?
      form.value['designation'] +' ('+ form.value['unity']+')' : form.value['designation'];

    let params = {
      'debursementId': null,
      'designation': designation,
      'quatity': form.value['qte'],
      'unitprice': form.value['unitprice'],
      'status': "active"
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {

        } else {
          console.error('Verifiez que tous les champs son entré correctement');
        }
        callback(data.response);
      },
      error => console.error('There was an error!', error));
  }

  getAllDisbursements(callback: (disburs: Disbursement[]) => void) {

    let url = UtilsResources.baseUrl + '/disbusement/requests';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          callback(data.response);
        } else {
          console.error('Une erreur s\'est produite');
        }
      },
      error => console.error('There was an error!', error));
  }
  getUserDisbursementList(userId: number | undefined, callback: (disburs: Disbursement[]) => void) {

    let url = UtilsResources.baseUrl + '/disbusement/user/' + userId + '/requests';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          callback(data.response);
        } else {
          console.error('Une erreur s\'est produite');
        }
      },
      error => console.error('There was an error!', error));
  }
  getDisbursementRequest(disbursementId: number, callback: (disburs: Disbursement) => void) {

    let url = UtilsResources.baseUrl + '/disbusement/request/' + disbursementId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          callback(data.response);
        } else {
          console.error('Une erreur s\'est produite');
        }
      },
      error => console.error('There was an error!', error));
  }
  getPendingDisbursements(callback: (disburs: Disbursement[]) => void) {

    let url = UtilsResources.baseUrl + '/disbusement/requests/waiting';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          callback(data.response);
        } else {
          console.error('Une erreur s\'est produite');
        }
      },
      error => console.error('There was an error!', error));
  }

  setValidationDisbursement(userId: number | undefined, disbursement: Disbursement, valForm: NgForm, callback: (data: any) => void) {

    let url = UtilsResources.baseUrl + '/disbusement/validation/request/' + disbursement.debursementId;

    let noticeClaimant = 7;
    let noticeAdmins = 9;

    let paynow = valForm.value['paynow'];

    let action = '';
    let currentStep: number = disbursement.currentStep!=null ? parseInt(disbursement.currentStep) : 0;
    //if (limitStep < currentStep) currentStep = limitStep;

    switch (currentStep) {
      case 0:
        action = valForm.value['valid']!=true ? 'rejected' : 'approuved';
        noticeClaimant = disbursement.amountRequested==valForm.value['amountapprouved'] ? 7 : 8;
        noticeAdmins = 9;
        break;
      //case limitStep:
        //action = valForm.value['valid']!='true' ? 'rejected' : 'treated';
        //noticeClaimant = 12;
        //noticeAdmins = 15;
        //break;
      default:
        action = valForm.value['valid']!='true' ? 'rejected' : 'verified';
        noticeClaimant = 11;
        noticeAdmins = 10;
        break;
    }

    if (action=='rejected') {
      noticeClaimant = 13;
      noticeAdmins = 14;
    }

    if (paynow==true) {
      noticeClaimant = 12;
      noticeAdmins = 15;
    }

    let params = {
      'userId': userId,
      'amountApproved' : valForm.value['amountapprouved'],
      'actionValue': action,
      'observation': valForm.value['observation'],
      'payment': valForm.value['paymode']
    };

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });


    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          this.userService.sendLocalNotification(data.response.userId, noticeClaimant,'/decaissement/historique');
          this.userService.sendLocalNotification(data.response.userId, noticeAdmins,'/moderateur/requete/' + disbursement.debursementId);
          this.userService.getUserFcmToken(data.response.userId, token => {
            this.userService.sendAndroidNotification(noticeClaimant, false, token, '/decaissement/historique');
          });   // Send recipient notification
          this.userService.getUserFcmToken(data.response.userId, token => {
            this.userService.sendAndroidNotification(noticeAdmins, false, token, '/moderateur/requete/' + disbursement.debursementId);
          });   // Send recipient notification
          this.userService.sendValidationMail(data.response);
          if (paynow==true) {
            this.exportDisbursementToPDF(disbursement.debursementId, ()=> {});
          }
          callback(data.response);
        } else if (data.statusCode=='ALREADY_EXISTS') {
          console.error('Un erreur s\'est produite');
        } else {
          alert('Verifiez que tous les champs sont entrés correctement');
        }
      },
      error => console.error('There was an error!', error));
  }

  treatedValidation(userId: number | undefined, disbursements: Disbursement[], callback: (treated: boolean) => void) {
    let treated = false;
    for (let disburs of disbursements) {
      for (let val of disburs.validations) {
        if (val.userId == userId) {
          treated = true;
          callback(treated);
        }
      }
    }
  }
  loadValidationChain(validations: ValidationAction[], callback: (validationChain: any[]) => void) {

    let validationChain: any[] = new Array<Object>();

    for(let val of validations) {
      let validator: string = '';
      let department: string | undefined = '';

      this.userService.getUser(val.userId, (user) => {
        validator = user.civility + '. ' + user.firstname + ' ' + user.lastname;

        this.userService.getUserOffices(val.userId, (offices) => {
          //for (let office of offices) {
          this.userService.getDepartement(offices[0].departmentId, (departement) => {
            department = departement.departmentName;
            var obj = {validator:validator, department:department, observation: val.observation ? val.observation : ''};
            validationChain.push(obj);
          });
          //}
        });
      });
    }
    callback(validationChain)
  }

  getDisbursementRapportByPeriod(form: NgForm | undefined, callback: (disbursRapport: DisbursRapport[]) => void) {

    let url: string = "";
    let from: any;
    let to: any;
    let treated: boolean = true;

    let bugdetsector: string = 'all';

    let today  = new Date();
    if (form==undefined) {
      from = this.datepipe.transform(today, 'yyyy-MM-dd');
      to =  this.datepipe.transform(today, 'yyyy-MM-dd');
      treated: false;
    } else {
      bugdetsector = form.value['bugdetsector'];
      from =  form.value['from'];
      to = form.value['to'];
      treated = form.value['treated'];
    }

    if (treated==true) {
      url = UtilsResources.baseUrl + '/export/sector/' + bugdetsector + '/disbursement/' + from + '/' + to + '/treated';
    } else {
      url = UtilsResources.baseUrl + '/export/sector/' + bugdetsector + '/disbursement/' + from + '/' + to;
    }

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          callback(data.response);
        } else {
          console.error('Verifiez que tous les champs son entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }

  exportDisbursementRapportByPeriod(form: NgForm): Observable<Blob> {
    let url: string = "";
    if (form.value['treated']==true) {
      url = UtilsResources.baseUrl + '/export/sector/'+form.value['bugdetsector']+'/disbursement/'+form.value['from']+'/'+form.value['to']+'/treated/to-excel';
    } else {
      url = UtilsResources.baseUrl + '/export/sector/'+form.value['bugdetsector']+'/disbursement/'+form.value['from']+'/'+form.value['to']+'/to-excel';
    }
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  exportDisbursementToPDF(debursementId: number | undefined, callback: () => void) {

    let url = UtilsResources.baseUrl + '/export/disbursement/'+ debursementId +'/to-pdf';
    return this.httpClient.get(url, { responseType: 'blob' }).subscribe((response) => {

      const blob = new Blob([response], {type:'application/pdf'});
      const data = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = data;
      link.download = 'Decaissement-'+ debursementId +'-'+ this.datepipe.transform(new Date(), 'dd-MM-yyyy') +'.pdf';
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);

      callback();
    });
  }
}
