import {HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpStatusCode} from '@angular/common/http'
import {inject} from '@angular/core'
import {catchError, EMPTY, switchMap, throwError} from 'rxjs'
import {AUTH_URL, AuthService} from '../services/auth.service'

const withToken = (request: HttpRequest<unknown>, token: string | null) =>
  token ? request.clone({setHeaders: {Authorization: `Bearer ${token}`}}) : request

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.startsWith(AUTH_URL)) {
    return next(request)
  }
  const auth = inject(AuthService)
  return next(withToken(request, auth.accessToken())).pipe(
    catchError(error => {
      if (!(error instanceof HttpErrorResponse) || error.status !== HttpStatusCode.Unauthorized) {
        return throwError(() => error)
      }
      return auth.refresh().pipe(
        switchMap(token => next(withToken(request, token))),
        catchError(() => EMPTY),
      )
    }),
  )
}
