export class Departement {

  departmentId: number | undefined;
  userId: number | undefined;
  departmentName: string | undefined;
  createdOn: string | undefined;
  updatedOn: string | undefined;
  offices: Office[] = new Array<Office>();

  constructor() {}
}

export class Profile {
  profileId: number | undefined;
  userId: number | undefined;
  profileName: string | undefined;
  profileLevel : string | undefined;
  createdOn: string | undefined;
  updatedOn: string | undefined;

  constructor() {}
}

export class Office {

  officeId: number | undefined;
  userId: number | undefined;
  departmentId: number  | undefined;
  officeName: string | undefined;
  createdOn: string | undefined;
  updatedOn: string | undefined;
  profile: Profile = new Profile();

  constructor() {}

}

export class User {

  userId: number | undefined;
  lastname: string | undefined;
  firstname: string | undefined;
  gender: string | undefined;
  civility: string | undefined;
  email: string | undefined;
  mobile: string | undefined;
  createdOn: string | undefined;
  updatedOn: string | undefined;
  status: string | undefined;
  offices: Office[] = new Array<Office>();

  constructor(){};
}

export class Notification {
  notificationId: number | undefined;
  notificationSubject: string | undefined;
  notificationDetails: string | undefined;
}

export class NotifUser {
  notifuserId: number | undefined;
  userId: number | undefined;
  notification: Notification = new Notification();
  notificationDate: string | undefined;
  notificationOpened: string | undefined;
  notificationLink: string | undefined
}
