import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {Task} from '../models/task'

@Injectable({providedIn: 'root'})
export class TaskService {
  private http = inject(HttpClient)

  create(columnId: string, name: string): Observable<Task> {
    return this.http.post<Task>(`${API_URL}/task/create`, {parentObjectId: columnId, name})
  }

  rename(taskId: string, name: string): void {
    this.http.post(`${API_URL}/task/rename`, {objectId: taskId, name}).subscribe()
  }

  changeColor(taskId: string, color: number): void {
    this.http.post(`${API_URL}/task/color`, {taskId, color}).subscribe()
  }

  move(taskId: string, columnId: string, position: number): void {
    const body = {movedObjectId: taskId, currentParentObject: columnId, currentPosition: position}
    this.http.post(`${API_URL}/task/move`, body).subscribe()
  }

  delete(taskId: string): void {
    this.http.post(`${API_URL}/task/delete`, {objectId: taskId}).subscribe()
  }
}
