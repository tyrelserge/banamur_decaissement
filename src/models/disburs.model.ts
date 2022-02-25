
export class ValidationAction {
  actionId: number | undefined;
  userId: number | undefined;
  debursementId: number | undefined;
  actionType: string | undefined;
  actionValue: string | undefined;
  observation: string | undefined;
  validatedDate: string | undefined;
  updatedOn: string | undefined;
}

export class ReasonItems {
  reasonitemId: number | undefined;
  debursementId: number | undefined;
  designation: string | undefined;
  unitprice: number | undefined;
  quatity: number | undefined;
  totalprice: number | undefined;
  createdOn: string | undefined;
  updatedOn: string | undefined;
  status: string | undefined;
}

export class Disbursement {
  debursementId: number | undefined;
  budgindexId: number | undefined;
  userId: number | undefined;
  identifier: string | undefined;
  reason: string | undefined;
  amountRequested: number | undefined;
  recipientId: number | undefined;
  createdOn: string | undefined;
  amountApproved: string | undefined;
  activateDebursement: string | undefined;
  updatedOn: string | undefined;
  currentStep: string | undefined;
  status: string | undefined;
  reasonItems:  ReasonItems[] = new Array<ReasonItems>();
  validations: ValidationAction[] = new Array<ValidationAction>()
}
