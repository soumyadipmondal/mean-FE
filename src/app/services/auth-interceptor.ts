import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authServ: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this._authServ.getToken();
    const modifiedReq = req.clone({
      headers: req.headers.set('authorization', 'Bearer ' + token),
    });
    console.log(modifiedReq);
    return next.handle(modifiedReq).pipe(
      catchError((error: any) => {
        alert(error.error.message);
        //return new Observable<HttpEvent<any>>();
        return throwError('');
      })
    );
  }
}
