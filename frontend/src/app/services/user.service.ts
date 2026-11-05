import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {API_URL} from '../data/url'
import {ProfileUpdate, User} from '../models/user'

@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient)

  getMe(): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/me`)
  }

  setDarkTheme(darkTheme: boolean): Observable<void> {
    return this.http.patch<void>(`${API_URL}/users/me`, {darkTheme})
  }

  setLastBoard(lastBoardId: string | null): Observable<void> {
    return this.http.patch<void>(`${API_URL}/users/me`, {lastBoardId})
  }

  updateProfile(profile: ProfileUpdate): Observable<void> {
    return this.http.patch<void>(`${API_URL}/users/me`, profile)
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.patch<void>(`${API_URL}/users/me`, {currentPassword, newPassword})
  }
}
