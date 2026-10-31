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

  rename(subtaskId: string, name: string): void {
    this.http.patch(`${API_URL}/subtasks/${subtaskId}`, {name}).subscribe()
  }

  changeState(subtaskId: string, state: boolean): void {
    this.http.patch(`${API_URL}/subtasks/${subtaskId}`, {state}).subscribe()
  }

  move(subtaskId: string, taskId: string, index: number): void {
    this.http.patch(`${API_URL}/subtasks/${subtaskId}`, {taskId, index}).subscribe()
  }

  delete(subtaskId: string): void {
    this.http.delete(`${API_URL}/subtasks/${subtaskId}`).subscribe()
  }
}
