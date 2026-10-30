import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "./error.service";
import {catchError, Observable, throwError} from "rxjs";
import {Task} from "../models/task";
import {url} from "../data/url";
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  createTask(taskListId: string, name: string, position: number): Observable<Task> {
    const data = {parentObjectId: taskListId, name: name, position: position}
    return this.http.post<Task>(`${url}/task/create`, data).pipe(catchError(this.errorHandler.bind(this)))
  }

  renameTask(taskId: string, name: string): void {
    const data = {objectId: taskId, name: name}
    this.http.post(`${url}/task/rename`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  changeTaskState(taskId: string, state: boolean): void {
    const data = {taskId: taskId, state: state}
    this.http.post(`${url}/task/state`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  moveTask(taskId: string, previousTaskListId: string,
           previousPosition: number, currentTaskListId: string, currentPosition: number): void {
    const data = {
      movedObjectId: taskId, previousParentObject: previousTaskListId, previousPosition: previousPosition,
      currentParentObject: currentTaskListId, currentPosition: currentPosition
    }
    this.http.post(`${url}/task/move`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  deleteTask(taskId: string, taskListId: string, position: number): void {
    const data = {objectId: taskId, parentObjectId: taskListId,  position: position}
    this.http.post(`${url}/task/delete`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
