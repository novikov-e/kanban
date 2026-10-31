import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {Subtask} from '../models/subtask'

@Injectable({providedIn: 'root'})
export class SubtaskService {
  private http = inject(HttpClient)

  create(taskId: string, name: string): Observable<Subtask> {
    return this.http.post<Subtask>(`${API_URL}/tasks/${taskId}/subtasks`, {name})
  }

  rename(subtaskId: string, name: string): Observable<void> {
    return this.http.patch<void>(`${API_URL}/subtasks/${subtaskId}`, {name})
  }

  changeState(subtaskId: string, state: boolean): Observable<void> {
    return this.http.patch<void>(`${API_URL}/subtasks/${subtaskId}`, {state})
  }

  move(subtaskId: string, taskId: string, index: number): Observable<void> {
    return this.http.patch<void>(`${API_URL}/subtasks/${subtaskId}`, {taskId, index})
  }

  delete(subtaskId: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/subtasks/${subtaskId}`)
  }
}
