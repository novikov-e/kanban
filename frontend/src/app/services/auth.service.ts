import {HttpClient} from '@angular/common/http'
import {computed, inject, Injectable, signal} from '@angular/core'
import {catchError, EMPTY, finalize, map, Observable, of, shareReplay, tap} from 'rxjs'
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
  private sessionEnded = false
  private refreshing$: Observable<string> | null = null

  readonly accessToken = this.token.asReadonly()
  readonly isAuthenticated = computed(() => this.token() !== null)

  login(credentials: Credentials): Observable<void> {
    return this.authenticate(`${AUTH_URL}/login`, credentials)
  }

  register(credentials: Credentials): Observable<void> {
    return this.authenticate(`${AUTH_URL}/register`, credentials)
  }

  restoreSession(): Observable<boolean> {
    if (this.isAuthenticated() || this.sessionEnded) {
      return of(this.isAuthenticated())
    }
    return this.refresh().pipe(
      map(() => true),
      catchError(() => of(false)),
    )
  }

  refresh(): Observable<string> {
    this.refreshing$ ??= this.http.post<TokenResponse>(`${AUTH_URL}/refresh`, null).pipe(
      map(response => response.accessToken),
      tap({next: token => this.setToken(token), error: () => this.setToken(null)}),
      finalize(() => (this.refreshing$ = null)),
      shareReplay(1),
    )
    return this.refreshing$
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${AUTH_URL}/logout`, null).pipe(
      catchError(() => EMPTY),
      finalize(() => this.setToken(null)),
    )
  }

  private authenticate(url: string, credentials: Credentials): Observable<void> {
    return this.http.post<TokenResponse>(url, credentials).pipe(
      tap(response => this.setToken(response.accessToken)),
      map(() => undefined),
    )
  }

  private setToken(token: string | null): void {
    this.token.set(token)
    this.sessionEnded = token === null
  }
}
