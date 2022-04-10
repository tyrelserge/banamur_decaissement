import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from "@angular/router";
import { ClaimantComponent } from './claimant/sectorselect/claimant.component';
import { ValidatorComponent } from './moderator/dashboard/validator.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupComponent } from './signin/signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import {AuthService} from "../services/auth.service";
import {GuardService} from "../services/guard.service";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { NavbarComponent } from './navbar/navbar.component';
import { DisbursementComponent } from './claimant/sectorselect/requestfields/disbursement.component';
import { FooterComponent } from './footer/footer.component';
import { RequestpendingComponent } from './moderator/requestspending/requestpending.component';
import { ClaimantrequestComponent } from './claimant/requestslist/claimantrequest.component';
import { UnallowedComponent } from './claimant/unallowed/unallowed.component';
import {UserService} from "../services/user.service";
import { ProfileComponent } from './profile/profile.component';
import {ProfileSettingsComponent} from "./profile/profile-settings/profile-settings.component";
import {BudgetService} from "../services/budget.service";
import {DisbursService} from "../services/disburs.service";
import { BrowserequestComponent } from './claimant/requestslist/consultrequest/browserequest.component';
import { ProcessrequestComponent } from './moderator/requestspending/processrequest/processrequest.component';
import {SettingService} from "../services/setting.service";
import { RequestoverviewComponent } from './moderator/requestoverview/requestoverview.component';
import { ProfilePreviewComponent } from './profile/profile-preview/profile-preview.component';
import { ResourcesSettingComponent } from './moderator/settings/resources-setting/resources-setting.component';
import { AccountsSettingComponent } from './moderator/settings/accounts-setting/accounts-setting.component';
import { GeneralSettingComponent } from './moderator/settings/general-setting/general-setting.component';
import { DepartmentSettingComponent } from './moderator/settings/department-setting/department-setting.component';
import { BudgetResourcesComponent } from './moderator/budget-resources/budget-resources.component';
import { DisbursementReportComponent } from './moderator/disbursement-report/disbursement-report.component';
import {DatePipe} from "@angular/common";

const appRoutes: Routes = [

  { path: 'connexion', component: SigninComponent },
  { path: 'inscription', component: SignupComponent },
  { path: 'unallowed', component: UnallowedComponent },

  { path: 'profil', canActivate:[GuardService], component: ProfileComponent },
  { path: 'profil/settings', canActivate:[GuardService], component: ProfileSettingsComponent },

  { path: 'decaissement', canActivate:[GuardService], component: ClaimantComponent },
  { path: 'decaissement/historique', canActivate:[GuardService], component: ClaimantrequestComponent },
  { path: 'decaissement/budgsector/:budgsectorid/demande', canActivate:[GuardService], component: DisbursementComponent },
  { path: 'decaissement/historique/requete/:disbursid', canActivate:[GuardService], component: BrowserequestComponent },

  { path: '', canActivate:[GuardService], component: ClaimantComponent },

  { path: 'moderateur', redirectTo: 'moderateur/dashbord'},
  { path: 'moderateur/dashbord', canActivate:[GuardService], component: ValidatorComponent },

  { path: 'moderateur/requetes', canActivate:[GuardService], component: RequestpendingComponent },
  { path: 'moderateur/requetes/requete/:disbursid/processing', canActivate:[GuardService], component: ProcessrequestComponent },
  { path: 'moderateur/requete/:disbursid', canActivate:[GuardService], component: RequestoverviewComponent },
  { path: 'moderateur/budget/ressources', canActivate:[GuardService], component: BudgetResourcesComponent },
  { path: 'moderateur/rapports', canActivate:[GuardService], component: DisbursementReportComponent },

  { path: 'moderateur/reglage', redirectTo: 'moderateur/reglage/general'},
  { path: 'moderateur/reglage/general', canActivate:[GuardService], component: GeneralSettingComponent },
  { path: 'moderateur/reglage/comptes', canActivate:[GuardService], component: AccountsSettingComponent },
  { path: 'moderateur/reglage/roles', canActivate:[GuardService], component: DepartmentSettingComponent },
  { path: 'moderateur/reglage/ressources', canActivate:[GuardService], component: ResourcesSettingComponent },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }

]

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ClaimantComponent,
    ValidatorComponent,
    SignupComponent,
    SigninComponent,
    NavbarComponent,
    DisbursementComponent,
    FooterComponent,
    RequestpendingComponent,
    ClaimantrequestComponent,
    UnallowedComponent,
    ProfileComponent,
    BrowserequestComponent,
    ProcessrequestComponent,
    ProfileSettingsComponent,
    RequestoverviewComponent,
    ProfilePreviewComponent,
    ResourcesSettingComponent,
    AccountsSettingComponent,
    GeneralSettingComponent,
    DepartmentSettingComponent,
    BudgetResourcesComponent,
    DisbursementReportComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    GuardService,
    UserService,
    BudgetService,
    DisbursService,
    SettingService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
