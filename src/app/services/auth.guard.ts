import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, OnDestroy {
  private authSub: Subscription;
  isAuthenticate: boolean;
  constructor(private _authServ: AuthService, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.authSub = this._authServ.authSubs$.subscribe((isAuth) => {
      if (!isAuth) {
        this._router.navigate(['/auth/login']);
      }
      this.isAuthenticate = isAuth;
    });
    console.log(this.isAuthenticate);
    return this.isAuthenticate;
  }

  ngOnDestroy() {}
}
