import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {Column} from '../models/column'

@Injectable({providedIn: 'root'})
export class ColumnService {
  private http = inject(HttpClient)

  create(boardId: string, name: string): Observable<Column> {
    return this.http.post<Column>(`${API_URL}/boards/${boardId}/columns`, {name})
  }

  rename(columnId: string, name: string): Observable<void> {
    return this.http.patch<void>(`${API_URL}/columns/${columnId}`, {name})
  }

  move(columnId: string, boardId: string, index: number): Observable<void> {
    return this.http.patch<void>(`${API_URL}/columns/${columnId}`, {boardId, index})
  }

  delete(columnId: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/columns/${columnId}`)
  }
}
