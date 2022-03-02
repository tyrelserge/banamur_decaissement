import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  isAuth:boolean | undefined;

  constructor( private authService: AuthService,
               private router: Router ){

  }

  ngOnInit(): void {
    this.isAuth = this.authService.isAuth();
    if (this.isAuth) this.router.navigate(['/']);
  }

  onSubmitConnexion(form: NgForm) {
    this.authService.signIn(form.value['username'], form.value['password'], ()=>{
      this.router.navigate(['/']);
    });
  }

}
