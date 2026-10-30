import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Project} from "../models/project";
import {ErrorService} from "./error.service";
import {Column} from "../models/column";
import {url} from "../data/url";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  createProject(userId: string, position: number): Observable<Project> {
    const data = {parentObjectId: userId, position: position}
    return this.http.post<Project>(`${url}/project/create`, data).pipe(catchError(this.errorHandler.bind(this)))
  }

  getProjectById(id: string): Observable<Project> {
    let params: HttpParams = new HttpParams().append('id', id)
    const data = {params: params}
    return this.http.get<Project>(`${url}/project`, data).pipe(catchError(this.errorHandler.bind(this)))
  }

  renameProject(projectId: string, name: string): void {
    const data = {objectId: projectId, name: name}
    this.http.post(`${url}/project/rename`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  deleteProject(userId: string, projectId: string, position: number): void {
    const data = {parentObjectId: userId, objectId: projectId, position: position}
    this.http.post(`${url}/project/delete`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  moveProject(projectId: string, previousUserId: string,
              previousPosition: number, currentUserId: string, currentPosition: number): void {
    const data = {movedObjectId: projectId, previousParentObject: previousUserId, previousPosition: previousPosition,
      currentParentObject: currentUserId, currentPosition: currentPosition}
    this.http.post(`${url}/project/move`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
