import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  login: any;
  private authSub: Subscription;
  constructor(private _authServ: AuthService, private _router: Router) {}

  ngOnInit(): void {
    this.login = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      pwd: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onLogin() {
    const authData: any = {
      email: this.login.value.email,
      password: this.login.value.pwd,
    };
    this._authServ.login(authData);
    this.authSub = this._authServ.authSubs$.subscribe((isAuth) => {
      if (isAuth) {
        console.log('User has been Authenticated Successfully');
        this._router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
  }
}
