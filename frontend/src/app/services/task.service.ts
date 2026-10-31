import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {Task} from '../models/task'

@Injectable({providedIn: 'root'})
export class TaskService {
  private http = inject(HttpClient)

  create(columnId: string, name: string): Observable<Task> {
    return this.http.post<Task>(`${API_URL}/columns/${columnId}/tasks`, {name})
  }

  rename(taskId: string, name: string): Observable<void> {
    return this.http.patch<void>(`${API_URL}/tasks/${taskId}`, {name})
  }

  changeColor(taskId: string, color: number): Observable<void> {
    return this.http.patch<void>(`${API_URL}/tasks/${taskId}`, {color})
  }

  move(taskId: string, columnId: string, index: number): Observable<void> {
    return this.http.patch<void>(`${API_URL}/tasks/${taskId}`, {columnId, index})
  }

  delete(taskId: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/tasks/${taskId}`)
  }
}
