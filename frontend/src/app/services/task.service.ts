import {Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {ErrorService} from "./error.service";
import {Task} from "../models/task";
import {url} from "../data/url";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  createTask(columnId: string, name: string, position: number): Observable<Task> {
    const data = {parentObjectId: columnId, name: name, position: position}
    return this.http.post<Task>(`${url}/task/create`, data).pipe(catchError(this.errorHandler.bind(this)))
  }

  renameTask(taskId: string, name: string): void {
    const data = {objectId: taskId, name: name}
    this.http.post(`${url}/task/rename`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  changeTaskColor(taskId: string, color: number): void {
    const data = {taskId: taskId, color: color}
    this.http.post(`${url}/task/color`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  moveTask(taskId: string, previousColumnId: string,
           previousPosition: number, currentColumnId: string, currentPosition: number): void {
    const data = {
      movedObjectId: taskId, previousParentObject: previousColumnId, previousPosition: previousPosition,
      currentParentObject: currentColumnId, currentPosition: currentPosition
    }
    this.http.post(`${url}/task/move`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  deleteTask(taskId: string, columnId: string, position: number): void {
    const data = {objectId: taskId, parentObjectId: columnId, position: position}
    this.http.post(`${url}/task/delete`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
