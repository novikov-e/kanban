import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {User} from "../models/user";
import {ErrorService} from "./error.service";
import {url} from "../data/url";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);


  getUser(): Observable<User> {
    return this.http.get<User>(`${url}/user`).pipe(catchError(this.errorHandler.bind(this)))
  }

  darkTheme(userId: string, darkTheme: boolean): void {
    const data = {id: userId, darkTheme: darkTheme}
    this.http.post(`${url}/user/theme`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  lastBoard(userId: string, boardId: string | null): void {
    const data = {userId: userId, boardId: boardId}
    this.http.post(`${url}/user/last_board`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
