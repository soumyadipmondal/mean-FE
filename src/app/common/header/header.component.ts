import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private _authServ: AuthService, private _router: Router) {}
  public authSub: Subscription;
  public iSAuthSuccess: boolean = false;

  ngOnInit(): void {
    this.authSub = this._authServ.authSubs$.subscribe((isAuth) => {
      this.iSAuthSuccess = isAuth;
    });
  }

  onLogout() {
    this._authServ.logout();
    this._router.navigate(['/logout']);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
