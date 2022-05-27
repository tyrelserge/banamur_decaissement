import {BudgetIndex, BudgetSecteur, GroupedBudget} from "../models/budget.model";
import {ResponseInterface} from "../models/response.interface";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {UtilsResources} from "./utils.resources";

@Injectable()
export class BudgetService {

  constructor(private httpClient: HttpClient) {}

  getBudgetSector(budgetSectorId: number | undefined, callback: (budgetSector: BudgetSecteur) => void) {

    const url = UtilsResources.baseUrl + '/budget/sector/'+budgetSectorId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback(data.response);
        } else {
          console.error("Aucun profil trouvé");
        }
      },
      error => console.error('There was an error!', error));
  }
  getGroupBugdet(groupBudgetId: number | undefined, callback:(groupBudget: GroupedBudget) => void) {

    let url = UtilsResources.baseUrl + '/budget/groupedbudget/' + groupBudgetId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback(data.response);
        } else {
          alert("Ce Budget samble ne pas exister !");
        }
      },
      error => {
        console.error('There was an error!', error)
      });
  }
  getBugdetIndex(budgindexId: number | undefined, callback:(budgetIndex: BudgetIndex) => void) {

    let url = UtilsResources.baseUrl + '/budget/budgetindex/' + budgindexId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback(data.response);
        } else {
          alert("Cet index samble ne pas exister !");
        }
      },
      error => {
        console.error('There was an error!', error)
      });
  }

  addGroupBudget(userId: number | undefined, form: NgForm, callback: (groupBudget: GroupedBudget) => void) {

    let url = UtilsResources.baseUrl + '/budget/groupedbudget';

    let params = {
      'userId': userId,
      'budgsectorId': form.value['sector'],
      'groupedbudgetName': form.value['groupname'],
      'groupedbudgetDescription': form.value['describtion'],
      'groupedbudgetValue': form.value['estimate'],
      'status': 'active',
      'renewal': null
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
  addBudgetIndex(userId: number | undefined, form: NgForm, callback: (budgetIndex: BudgetIndex) => void) {


    let url = UtilsResources.baseUrl + '/budget/budgetindex';

    let params = {
      'userId': userId,
      'budgsectorId': form.value['budgsectorid'],
      'groupedbudgetId': form.value['groupbudget'],
      'budgindexName': form.value['indexname'],
      'budgetindexDescription': form.value['describtion'],
      'budgetindexValue': form.value['estimate'],
      'status': 'active',
      'renewal': null
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

  getBudgetSectorList(callback: (budgetSector: BudgetSecteur[]) => void) {

    const url = UtilsResources.baseUrl + '/budget/sectors';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback(data.response);
        } else {
          console.error("Aucun profil trouvé");
        }
      },
      error => console.error('There was an error!', error));
  }
  getGroupBudgetList(callback:(groupsBudget: GroupedBudget[]) => void) {

    let url = UtilsResources.baseUrl + "/budget/groupedbudgets";

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback(data.response);
        } else {
          console.error("Une erreur s'est produite !");
        }
      },
      error => {
        console.error('There was an error!', error)
      });
  }
  getBugdetIndexList(callback:(budgetsIndex: BudgetIndex[]) => void) {

    let url = UtilsResources.baseUrl + "/budget/budgetindexs";

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback(data.response);
        } else {
          console.error("Une erreur s'est produite !");
        }
      },
      error => {
        console.error('There was an error!', error)
      });
  }

  searchIndexIntoSelectedBudget(groupbudget: string, input: string, callback: (budgetsIndex: BudgetIndex[]) => void) {

    let url = UtilsResources.baseUrl + "/budget/groupedbudget/"+ groupbudget +"/budgetindex/search/"+ input;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback(data.response);
        } else {
          console.info("aucune information trouvée !");
        }
      },
      error => {
        console.error('There was an error!', error)
      });
  }

  searchInputGroupedBudget(input: string, callback: (groupedBudget: GroupedBudget[]) => void) {

    let url = UtilsResources.baseUrl + "/budget/groupedbudget/search/"+ input;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          callback(data.response);
        } else {
          console.info("aucune information trouvée !");
        }
      },
      error => {
        console.error('There was an error!', error)
      });
  }
}
