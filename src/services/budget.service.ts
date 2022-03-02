import {BudgetIndex, BudgetSecteur} from "../models/budget.model";
import {ResponseInterface} from "../models/response.interface";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class BudgetService {

  constructor(private httpClient: HttpClient) {}

  getSelectedSector(id: number | undefined, callback: (budgsector: BudgetSecteur) => void) {

    let url = "http://62.171.152.70:8080/decaissement-api-0.0.1/budget/sector";
    let budgetSector:any = new BudgetSecteur();

    this.httpClient.get<ResponseInterface>(url + '/' + id).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          budgetSector = data.response
        } else {
          console.error("Ce secteur samble ne pas exister !");
        }
        callback(budgetSector);
      },
      error => {
        console.error('There was an error!', error)
      });
  }

  getBugdetIndexList(callback:(budgetIndex: BudgetIndex) => void) {

    let url = "http://62.171.152.70:8080/decaissement-api-0.0.1/budget/budgetindexs";

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

  getBugdetIndex(budgindexId: number | undefined, callback:(budgetIndex: BudgetIndex) => void) {

    let url = 'http://62.171.152.70:8080/decaissement-api-0.0.1/budget/budgetindex/' + budgindexId;

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
}
