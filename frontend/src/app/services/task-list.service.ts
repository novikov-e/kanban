import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {ErrorService} from "./error.service";
import {TaskList} from "../models/task-list";
import {url} from "../data/url";

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  createTaskList(columnId: string, name: string, position: number): Observable<TaskList> {
    const data = {parentObjectId: columnId, name: name, position: position}
    return this.http.post<TaskList>(`${url}/task_list/create`, data).pipe(catchError(this.errorHandler.bind(this)))
  }

  renameTaskList(taskListId: string, name: string): void {
    const data = {objectId: taskListId, name: name}
    this.http.post(`${url}/task_list/rename`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  changeTaskListColor(taskListId: string, color: number): void {
    const data = {taskListId: taskListId, color: color}
    this.http.post(`${url}/task_list/color`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  moveTaskList(taskListId: string, previousColumnId: string,
               previousTaskListPosition: number, currentColumnId: string, currentTaskListPosition: number): void {
    const data = {
      movedObjectId: taskListId, previousParentObject: previousColumnId, previousPosition: previousTaskListPosition,
      currentParentObject: currentColumnId, currentPosition: currentTaskListPosition
    }
    this.http.post(`${url}/task_list/move`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  deleteTaskList(taskListId: string, columnId: string, taskListPosition: number): void {
    const data = {objectId: taskListId, parentObjectId: columnId, position: taskListPosition}
    this.http.post(`${url}/task_list/delete`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
