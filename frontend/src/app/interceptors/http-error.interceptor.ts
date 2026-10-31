import {HttpErrorResponse, HttpInterceptorFn, HttpStatusCode} from '@angular/common/http'
import {inject} from '@angular/core'
import {MatSnackBar} from '@angular/material/snack-bar'
import {catchError, throwError} from 'rxjs'
import {AUTH_URL} from '../services/auth.service'

const ERROR_MESSAGE = 'Не удалось выполнить запрос к серверу.'

/** Для подписок, которым нечего откатывать: об ошибке пользователю уже сообщил перехватчик. */
export const errorAlreadyReported = (): void => undefined

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.startsWith(AUTH_URL)) {
    return next(request)
  }
  const snackBar = inject(MatSnackBar)
  return next(request).pipe(
    catchError(error => {
      if (!(error instanceof HttpErrorResponse) || error.status !== HttpStatusCode.NotModified) {
        snackBar.open(ERROR_MESSAGE, 'Закрыть', {horizontalPosition: 'end', verticalPosition: 'top'})
      }
      return throwError(() => error)
    }),
  )
}
