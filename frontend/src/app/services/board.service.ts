import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {Board} from '../models/board'

@Injectable({providedIn: 'root'})
export class BoardService {
  private http = inject(HttpClient)

  get(boardId: string): Observable<Board> {
    return this.http.get<Board>(`${API_URL}/board`, {params: {id: boardId}})
  }

  create(userId: string): Observable<Board> {
    return this.http.post<Board>(`${API_URL}/board/create`, {parentObjectId: userId})
  }

  rename(boardId: string, name: string): void {
    this.http.post(`${API_URL}/board/rename`, {objectId: boardId, name}).subscribe()
  }

  move(boardId: string, userId: string, position: number): void {
    const body = {movedObjectId: boardId, currentParentObject: userId, currentPosition: position}
    this.http.post(`${API_URL}/board/move`, body).subscribe()
  }

  delete(boardId: string): void {
    this.http.post(`${API_URL}/board/delete`, {objectId: boardId}).subscribe()
  }
}
