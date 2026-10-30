import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "./error.service";
import {catchError, Observable, throwError} from "rxjs";
import {Subtask} from "../models/subtask";
import {url} from "../data/url";

@Injectable({
  providedIn: 'root'
})
export class SubtaskService {

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  createSubtask(taskId: string, name: string, position: number): Observable<Subtask> {
    const data = {parentObjectId: taskId, name: name, position: position}
    return this.http.post<Subtask>(`${url}/subtask/create`, data).pipe(catchError(this.errorHandler.bind(this)))
  }

  renameSubtask(subtaskId: string, name: string): void {
    const data = {objectId: subtaskId, name: name}
    this.http.post(`${url}/subtask/rename`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  changeSubtaskState(subtaskId: string, state: boolean): void {
    const data = {subtaskId: subtaskId, state: state}
    this.http.post(`${url}/subtask/state`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  moveSubtask(subtaskId: string, previousTaskId: string,
              previousPosition: number, currentTaskId: string, currentPosition: number): void {
    const data = {
      movedObjectId: subtaskId, previousParentObject: previousTaskId, previousPosition: previousPosition,
      currentParentObject: currentTaskId, currentPosition: currentPosition
    }
    this.http.post(`${url}/subtask/move`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  deleteSubtask(subtaskId: string, taskId: string, position: number): void {
    const data = {objectId: subtaskId, parentObjectId: taskId, position: position}
    this.http.post(`${url}/subtask/delete`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
