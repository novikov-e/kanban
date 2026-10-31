import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {Subtask} from '../models/subtask'

@Injectable({providedIn: 'root'})
export class SubtaskService {
  private http = inject(HttpClient)

  create(taskId: string, name: string): Observable<Subtask> {
    return this.http.post<Subtask>(`${API_URL}/subtask/create`, {parentObjectId: taskId, name})
  }

  rename(subtaskId: string, name: string): void {
    this.http.post(`${API_URL}/subtask/rename`, {objectId: subtaskId, name}).subscribe()
  }

  changeState(subtaskId: string, state: boolean): void {
    this.http.post(`${API_URL}/subtask/state`, {subtaskId, state}).subscribe()
  }

  move(subtaskId: string, taskId: string, position: number): void {
    const body = {movedObjectId: subtaskId, currentParentObject: taskId, currentPosition: position}
    this.http.post(`${API_URL}/subtask/move`, body).subscribe()
  }

  delete(subtaskId: string): void {
    this.http.post(`${API_URL}/subtask/delete`, {objectId: subtaskId}).subscribe()
  }
}
