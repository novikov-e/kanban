import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {User} from '../models/user'

@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient)

  getUser(): Observable<User> {
    return this.http.get<User>(`${API_URL}/user`)
  }

  setDarkTheme(darkTheme: boolean): void {
    this.http.post(`${API_URL}/user/theme`, {darkTheme}).subscribe()
  }

  setLastBoard(boardId: string | null): void {
    this.http.post(`${API_URL}/user/last_board`, {boardId}).subscribe()
  }
}
