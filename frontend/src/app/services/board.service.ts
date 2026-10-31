import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {Board} from '../models/board'

@Injectable({providedIn: 'root'})
export class BoardService {
  private http = inject(HttpClient)

  get(boardId: string): Observable<Board> {
    return this.http.get<Board>(`${API_URL}/boards/${boardId}`)
  }

  create(): Observable<Board> {
    return this.http.post<Board>(`${API_URL}/boards`, null)
  }

  rename(boardId: string, name: string): void {
    this.http.patch(`${API_URL}/boards/${boardId}`, {name}).subscribe()
  }

  move(boardId: string, index: number): void {
    this.http.patch(`${API_URL}/boards/${boardId}`, {index}).subscribe()
  }

  delete(boardId: string): void {
    this.http.delete(`${API_URL}/boards/${boardId}`).subscribe()
  }
}
