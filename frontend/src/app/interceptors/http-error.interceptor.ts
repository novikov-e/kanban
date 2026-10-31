import {HttpErrorResponse, HttpInterceptorFn, HttpStatusCode} from '@angular/common/http'
import {inject} from '@angular/core'
import {MatSnackBar} from '@angular/material/snack-bar'
import {catchError, EMPTY, throwError} from 'rxjs'
import {AUTH_URL} from '../services/auth.service'

const ERROR_MESSAGE = 'Произошла ошибка, пожалуйста перезагрузите страницу.'

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.startsWith(AUTH_URL)) {
    return next(request)
  }
  const snackBar = inject(MatSnackBar)
  return next(request).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.NotModified) {
        return throwError(() => error)
      }
      snackBar.open(ERROR_MESSAGE, 'Закрыть', {horizontalPosition: 'end', verticalPosition: 'top'})
      return EMPTY
    }),
  )
}
