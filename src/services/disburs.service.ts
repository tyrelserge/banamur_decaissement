import {Injectable} from "@angular/core";
import {NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseInterface} from "../models/response.interface";
import {UserService} from "./user.service";
import {Disbursement, ReasonItems, ValidationAction} from "../models/disburs.model";
import {Router} from "@angular/router";
import {User} from "../models/user.model";

@Injectable()
export class DisbursService {

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private router: Router) {}

  addDisbursmentRequest(userId:number | undefined, form: NgForm, reasonIds:number[], callback: (response: Disbursement) => void) {

    let url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/disbusement/request';

    let recipient = form.value['for'][0]!=null && form.value['for'][0]!='' ? form.value['for'][0] : form.value['for'];

    let params = {
      'budgindexId': form.value['budgetIndex'],
      'userId': userId,
      'identifier': form.value['numero'],
      'reason': form.value['reason'],
      'amountRequested': form.value['totalamount'],
      'recipientId': recipient!=null ? recipient : userId,
      'status': 'submitted',
      'reasonItemsIds': reasonIds
    };

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });



    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          this.userService.sendNotification(data.response.userId, 4, 5, '/moderateur/pending-requetes');
          this.userService.sendDisbursmentMail(data.response);
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

    let url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/disbusement/request/reason';

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

    let url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/disbusement/requests';

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

    let url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/disbusement/user/' + userId + '/requests';

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

    let url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/disbusement/request/' + disbursementId;

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

    let url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/disbusement/requests/waiting';

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

  setValidationDisbursement(userId: number | undefined, limitStep: number,
                            disbursement: Disbursement, valForm: NgForm, callback: (data: any) => void) {

    let url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/disbusement/validation/request/' + disbursement.debursementId;

    let noticeClaimant = 7;
    let noticeAdmins = 9;

    let action = '';
    let currentStep: number = disbursement.currentStep!=null ? parseInt(disbursement.currentStep) : 0;
    if (limitStep < currentStep) currentStep = limitStep;

    switch (currentStep) {
      case 0:
        action = valForm.value['valid']!='true' ? 'rejected' : 'approuved';
        noticeClaimant = disbursement.amountRequested==valForm.value['amountapprouved'] ? 7 : 8;
        noticeAdmins = 9;
        break;
      case limitStep:
        action = valForm.value['valid']!='true' ? 'rejected' : 'treated';
        noticeClaimant = 12;
        noticeAdmins = 15;
        break;
      default:
        action = valForm.value['valid']!='true' ? 'rejected' : 'confirmed';
        noticeClaimant = 11;
        noticeAdmins = 10;
        break;
    }

    if (action=='rejected') {
      noticeClaimant = 13;
      noticeAdmins = 14;
    }

    let params = {
      'userId': userId,
      'amountApproved' : valForm.value['amountapprouved'],
      'actionValue': action,
      'observation': valForm.value['observation']
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })


    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode=='SUCCESS') {
          this.userService.sendNotification(data.response.userId, noticeClaimant, noticeAdmins, '/');
          this.userService.sendValidationMail(data.response);
          callback(data.response);
        } else if (data.statusCode=='ALREADY_EXISTS') {
          console.error('Un erreur s\'est produite');
        } else {
          alert('Verifiez que tous les champs son entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }
  treatedValidation(userId: number | undefined, disbursements: Disbursement[], callback: (data: any) => void) {
    let treated = false;
    for (let disburs of disbursements) {
      for (let val of disburs.validations) {
        if (val.userId == userId) {
          treated = true;
        }
      }
    }
    callback(treated);
  }
  loadValidationChain(validations: ValidationAction[], callback: (validationChain: any[]) => void) {

    let validator: string = '';
    let department: string | undefined = '';
    let validationChain: any[] = new Array<Object>();

    for(let val of validations) {
      this.userService.getUser(val.userId, (user) => {
        validator = user.civility + '. ' + user.firstname + ' ' + user.lastname;

        this.userService.getUserOffices(val.userId, (offices) => {
          //for (let office of offices) {
          this.userService.getDepartement(offices[0].departmentId, (departement) => {
            department = departement.departmentName;
            var obj = {validator:validator, department:department, observation: val.observation ? val.observation : ''};
            validationChain.unshift(obj);
          });
          //}
        });
      });
    }
    callback(validationChain)
  }

}
