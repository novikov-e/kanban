import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {User} from '../models/user'

@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient)

  getMe(): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/me`)
  }

  setDarkTheme(darkTheme: boolean): void {
    this.http.patch(`${API_URL}/users/me`, {darkTheme}).subscribe()
  }

  setLastBoard(lastBoardId: string | null): void {
    this.http.patch(`${API_URL}/users/me`, {lastBoardId}).subscribe()
  }
}
