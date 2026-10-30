import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {ErrorService} from "./error.service";
import {Column} from "../models/column";
import {url} from "../data/url";

@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  createColumn(projectId: string, name: string, position: number): Observable<Column> {
    const data = {parentObjectId: projectId, name: name, position: position}
    return this.http.post<Column>(`${url}/column/create`, data).pipe(catchError(this.errorHandler.bind(this)))
  }

  renameColumn(columnId: string, name: string): void {
    const data = {objectId: columnId, name: name}
    this.http.post(`${url}/column/rename`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  moveColumn(columnId: string, previousProjectId: string,
             previousProjectPosition: number, currentProjectId: string, currentProjectPosition: number): void {
    const data = {
      movedObjectId: columnId, previousParentObject: previousProjectId, previousPosition: previousProjectPosition,
      currentParentObject: currentProjectId, currentPosition: currentProjectPosition
    }
    this.http.post(`${url}/column/move`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  deleteColumn(columnId: string, projectId: string,  columnPosition: number): void {
    const data = {objectId: columnId, parentObjectId: projectId, position: columnPosition}
    this.http.post(`${url}/column/delete`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
