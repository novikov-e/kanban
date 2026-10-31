import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {TestBed} from '@angular/core/testing'
import {AuthService} from '../services/auth.service'
import {authInterceptor} from './auth.interceptor'

describe('authInterceptor', () => {
  let http: HttpClient
  let httpMock: HttpTestingController
  let auth: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    })
    http = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
    auth = TestBed.inject(AuthService)
  })

  afterEach(() => httpMock.verify())

  it('refreshes an expired access token once and retries the request', () => {
    let response: unknown
    http.get('/api/v1/users/me').subscribe(body => (response = body))

    httpMock.expectOne('/api/v1/users/me').flush(null, {status: 401, statusText: 'Unauthorized'})
    httpMock.expectOne({method: 'POST', url: '/api/v1/auth/refresh'}).flush({accessToken: 'fresh-token'})

    const retry = httpMock.expectOne('/api/v1/users/me')
    expect(retry.request.headers.get('Authorization')).toBe('Bearer fresh-token')
    retry.flush({id: 'user-1'})

    expect(response).toEqual({id: 'user-1'})
    expect(auth.isAuthenticated()).toBe(true)
  })

  it('drops the session when the refresh token is rejected', () => {
    let completed = false
    http.get('/api/v1/users/me').subscribe({complete: () => (completed = true)})

    httpMock.expectOne('/api/v1/users/me').flush(null, {status: 401, statusText: 'Unauthorized'})
    httpMock.expectOne('/api/v1/auth/refresh').flush(null, {status: 401, statusText: 'Unauthorized'})

    expect(completed).toBe(true)
    expect(auth.isAuthenticated()).toBe(false)
  })
})
