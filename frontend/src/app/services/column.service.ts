import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {Column} from '../models/column'

@Injectable({providedIn: 'root'})
export class ColumnService {
  private http = inject(HttpClient)

  create(boardId: string, name: string): Observable<Column> {
    return this.http.post<Column>(`${API_URL}/column/create`, {parentObjectId: boardId, name})
  }

  rename(columnId: string, name: string): void {
    this.http.post(`${API_URL}/column/rename`, {objectId: columnId, name}).subscribe()
  }

  move(columnId: string, boardId: string, position: number): void {
    const body = {movedObjectId: columnId, currentParentObject: boardId, currentPosition: position}
    this.http.post(`${API_URL}/column/move`, body).subscribe()
  }

  delete(columnId: string): void {
    this.http.post(`${API_URL}/column/delete`, {objectId: columnId}).subscribe()
  }
}
