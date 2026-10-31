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

  rename(taskId: string, name: string): void {
    this.http.patch(`${API_URL}/tasks/${taskId}`, {name}).subscribe()
  }

  changeColor(taskId: string, color: number): void {
    this.http.patch(`${API_URL}/tasks/${taskId}`, {color}).subscribe()
  }

  move(taskId: string, columnId: string, index: number): void {
    this.http.patch(`${API_URL}/tasks/${taskId}`, {columnId, index}).subscribe()
  }

  delete(taskId: string): void {
    this.http.delete(`${API_URL}/tasks/${taskId}`).subscribe()
  }
}
