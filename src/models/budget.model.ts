
export class BudgetSecteur{
  budgsectorId: number | undefined;
  budgsectorChar: string | undefined;
  budgsectorName: string | undefined;
  budgsectorDescription: string | undefined;
  budgsectorImg: string | undefined;
  createdOn: string | undefined;
  updatedOn: string | undefined;
  status: string | undefined;

  constructor() {}
}

class Renewal {
  renewalId: number | undefined;
  applyDate: string | undefined;
  nextRenewal: string | undefined;
  createdOn: string | undefined;
  updatedOn: string | undefined;
  status: string | undefined;
}

export class GroupedBudget {
  groupedbudgetId: number | undefined;
  userId: number | undefined;
  budgsectorId: number | undefined;
  groupedbudgetName: string | undefined;
  groupedbudgetDescription: string | undefined;
  groupedbudgetValue: number | undefined;
  createdOn: string | undefined;
  updatedOn: string | undefined;
  status: string | undefined;
  renewal: Renewal[] = new Array<Renewal>();
}

export class BudgetIndex {
  budgindexId: number | undefined;
  userId: number | undefined;
  budgsectorId: number | undefined;
  groupedbudgetId: number | undefined;
  budgindexName: string | undefined;
  budgindexDescription: string | undefined;
  budgindexValue: string | undefined;
  createdOn: string | undefined;
  updatedOn: string | undefined;
  status: string | undefined;
  renewal: Renewal[] = new Array<Renewal>();
}
