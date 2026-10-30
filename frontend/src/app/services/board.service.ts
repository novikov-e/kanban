import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Board} from "../models/board";
import {ErrorService} from "./error.service";
import {url} from "../data/url";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  createBoard(userId: string, position: number): Observable<Board> {
    const data = {parentObjectId: userId, position: position}
    return this.http.post<Board>(`${url}/board/create`, data).pipe(catchError(this.errorHandler.bind(this)))
  }

  getBoardById(id: string): Observable<Board> {
    let params: HttpParams = new HttpParams().append('id', id)
    const data = {params: params}
    return this.http.get<Board>(`${url}/board`, data).pipe(catchError(this.errorHandler.bind(this)))
  }

  renameBoard(boardId: string, name: string): void {
    const data = {objectId: boardId, name: name}
    this.http.post(`${url}/board/rename`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  deleteBoard(userId: string, boardId: string, position: number): void {
    const data = {parentObjectId: userId, objectId: boardId, position: position}
    this.http.post(`${url}/board/delete`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  moveBoard(boardId: string, previousUserId: string,
            previousPosition: number, currentUserId: string, currentPosition: number): void {
    const data = {movedObjectId: boardId, previousParentObject: previousUserId, previousPosition: previousPosition,
      currentParentObject: currentUserId, currentPosition: currentPosition}
    this.http.post(`${url}/board/move`, data).pipe(catchError(this.errorHandler.bind(this))).subscribe()
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
