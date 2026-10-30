import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Project} from "../models/project";
import {User} from "../models/user";
import {ErrorService} from "./error.service";
import {url} from "../data/url";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private errorService: ErrorService) { }

  getUser(): Observable<User> {
    return this.http.get<User>(`${url}/user`).pipe(catchError(this.errorHandler.bind(this)))
  }

  darkTheme(userId: string, darkTheme: boolean): void {
    const data = {id: userId, darkTheme: darkTheme}
    this.http.post(`${url}/user/theme`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  lastProject(userId: string, projectId: string | null): void {
    const data = {userId: userId, projectId: projectId}
    this.http.post(`${url}/user/last_project`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
