import {HttpInterceptorFn} from '@angular/common/http'
import {inject} from '@angular/core'
import {MatSnackBar} from '@angular/material/snack-bar'
import {catchError, EMPTY} from 'rxjs'
import {AUTH_URL} from '../services/auth.service'

const ERROR_MESSAGE = 'Произошла ошибка, пожалуйста перезагрузите страницу.'

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.startsWith(AUTH_URL)) {
    return next(request)
  }
  const snackBar = inject(MatSnackBar)
  return next(request).pipe(
    catchError(() => {
      snackBar.open(ERROR_MESSAGE, 'Закрыть', {horizontalPosition: 'end', verticalPosition: 'top'})
      return EMPTY
    }),
  )
}
