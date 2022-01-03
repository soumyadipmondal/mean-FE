import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signup: any;
  isPwdMatched: boolean | undefined;
  blockedEmailAddrLink: string[] = ['test@te.com'];
  constructor(
    private _authServ: AuthService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('called');
    this.signup = new FormGroup(
      {
        signEmail: new FormControl(
          null,
          [
            Validators.required,
            Validators.email,
            this.customForbiddenEmailAddresses.bind(this),
          ]
          //this.emailAlreadyExists.bind(this)
        ),
        signPwd: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
        signCnfPwd: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      { validators: this.matchPasswordValidator }
    );
  }

  onSignup() {
    const authData: any = {
      email: this.signup.value.signEmail,
      password: this.signup.value.signPwd,
    };
    this._authServ.signUp(authData).subscribe((response) => {
      console.log(response);
      if (response.result) {
        this._router.navigate(['/auth/login'], { relativeTo: this._route });
      }
    });
  }

  customForbiddenEmailAddresses(
    control: FormControl
  ): { [s: string]: boolean } | null {
    console.log(control);
    if (this.blockedEmailAddrLink.indexOf(control.value) !== -1) {
      return { forbiddenEmail: true };
    }
    return null;
  }

  emailAlreadyExists(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    console.log(control);

    return of();
  }

  matchPasswordValidator<ValidatorFn>(
    control: AbstractControl
  ): ValidationErrors | null {
    console.log(
      control.get('signPwd')?.value,
      control.get('signCnfPwd')?.value
    );
    if (control.get('signPwd')?.value !== control.get('signCnfPwd')?.value) {
      return { matchError: true };
    }
    return null;
  }
}
