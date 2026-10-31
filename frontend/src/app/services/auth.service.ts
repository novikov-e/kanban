import {HttpClient} from '@angular/common/http'
import {computed, inject, Injectable, signal} from '@angular/core'
import {catchError, EMPTY, finalize, map, Observable, shareReplay, tap} from 'rxjs'
import {API_URL} from '../data/url'

interface TokenResponse {
  accessToken: string
}

export interface Credentials {
  email: string
  password: string
}

export const AUTH_URL = `${API_URL}/auth`

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient)
  private token = signal<string | null>(null)
  private refreshing$: Observable<string> | null = null

  readonly accessToken = this.token.asReadonly()
  readonly isAuthenticated = computed(() => this.token() !== null)

  login(credentials: Credentials): Observable<void> {
    return this.authenticate(`${AUTH_URL}/login`, credentials)
  }

  register(credentials: Credentials): Observable<void> {
    return this.authenticate(`${AUTH_URL}/register`, credentials)
  }

  refresh(): Observable<string> {
    this.refreshing$ ??= this.http.post<TokenResponse>(`${AUTH_URL}/refresh`, null).pipe(
      map(response => response.accessToken),
      tap({next: token => this.token.set(token), error: () => this.token.set(null)}),
      finalize(() => (this.refreshing$ = null)),
      shareReplay(1),
    )
    return this.refreshing$
  }

  /** Сессия завершается локально, даже если сервер недоступен. */
  logout(): Observable<void> {
    return this.http.post<void>(`${AUTH_URL}/logout`, null).pipe(
      catchError(() => EMPTY),
      finalize(() => this.token.set(null)),
    )
  }

  private authenticate(url: string, credentials: Credentials): Observable<void> {
    return this.http.post<TokenResponse>(url, credentials).pipe(
      tap(response => this.token.set(response.accessToken)),
      map(() => undefined),
    )
  }
}
