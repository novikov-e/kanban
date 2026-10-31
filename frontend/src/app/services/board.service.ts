import {HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {catchError, map, Observable, of, throwError} from 'rxjs'
import {API_URL} from '../data/url'
import {Board} from '../models/board'

export interface VersionedBoard {
  board: Board
  etag: string | null
}

@Injectable({providedIn: 'root'})
export class BoardService {
  private http = inject(HttpClient)

  get(boardId: string): Observable<VersionedBoard> {
    return this.request(boardId, new HttpHeaders())
  }

  /** Доска, если она изменилась с версии `etag`; иначе null. */
  getIfChanged(boardId: string, etag: string): Observable<VersionedBoard | null> {
    return this.request(boardId, new HttpHeaders({'If-None-Match': etag})).pipe(
      catchError(error =>
        error instanceof HttpErrorResponse && error.status === HttpStatusCode.NotModified
          ? of(null)
          : throwError(() => error),
      ),
    )
  }

  create(): Observable<Board> {
    return this.http.post<Board>(`${API_URL}/boards`, null)
  }

  rename(boardId: string, name: string): Observable<void> {
    return this.http.patch<void>(`${API_URL}/boards/${boardId}`, {name})
  }

  move(boardId: string, index: number): Observable<void> {
    return this.http.patch<void>(`${API_URL}/boards/${boardId}`, {index})
  }

  delete(boardId: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/boards/${boardId}`)
  }

  private request(boardId: string, headers: HttpHeaders): Observable<VersionedBoard> {
    return this.http
      .get<Board>(`${API_URL}/boards/${boardId}`, {headers, observe: 'response'})
      .pipe(map(response => ({board: response.body as Board, etag: response.headers.get('ETag')})))
  }
}
