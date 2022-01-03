import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authToken: any;
  private tokenTimer: any;
  public authSubs$ = new BehaviorSubject<boolean>(false);
  creatorId: string = '';
  constructor(private _http: HttpClient) {}

  getToken(): any {
    console.log(this.authToken);
    return this.authToken;
  }

  getCreatorId(): string {
    return this.creatorId;
  }

  signUp(authData: any) {
    return this._http.post<any>(
      'http://localhost:8000/api/user/signup',
      authData
    );
  }

  login(authData: any) {
    this._http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:8000/api/user/login',
        authData
      )
      .subscribe(
        (response) => {
          this.authToken = response.token;
          const expiresInDuration = response.expiresIn;
          if (this.authToken) {
            this.authSubs$.next(true);
            this.creatorId = response.userId;
            this.setAuthTimer(expiresInDuration);
            /* Creating a date */
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.setAuthData(this.authToken, expirationDate, this.creatorId);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  logout(): void {
    this.authToken = null;
    this.authSubs$.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.creatorId = '';
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (
      authInformation?.['token'] &&
      authInformation?.['expiration'] &&
      authInformation?.['creatorId']
    ) {
      const now = new Date();
      const expiresIn = authInformation.expiration.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.authSubs$.next(true);
        this.creatorId = authInformation.creatorId;
        this.authToken = authInformation.token;
        this.setAuthTimer(expiresIn / 1000);
      }
    }
  }

  /* Private Methods to save token and expires date and clear on log out */
  private setAuthData(token: string, expiresDate: Date, creatorId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expiresDate.toISOString());
    localStorage.setItem('creatorId', creatorId);
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expirationDate');
    const creatorId = localStorage.getItem('creatorId');
    if (!token || !expiration || !creatorId) return null;
    return {
      token,
      expiration: new Date(expiration),
      creatorId,
    };
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('creatorId');
  }

  private setAuthTimer(duration: number) {
    console.log('Setting Auth Timer::' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
