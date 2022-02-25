import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {User} from "../models/user.model";

@Injectable()
export class GuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.isAuth()) {
      if (!this.authService.isAllowed()) {
        this.router.navigate(['/unallowed']);
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/connexion']);
    }
    return false;
  }

}
