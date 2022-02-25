// @ts-ignore
import Any = jasmine.Any;
import { User } from "./user.model";
import {BudgetSecteur} from "./budget.model";

export interface ResponseInterface {
  statusCode: string;
  response: Any;
}

export interface ResponseUser {
  statusCode: string;
  response: User;
}

export  interface ResponseSector {
  statusCode: string;
  response: BudgetSecteur;
}
