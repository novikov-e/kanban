import {HttpInterceptorFn} from '@angular/common/http'
import {inject} from '@angular/core'
import {MatSnackBar} from '@angular/material/snack-bar'
import {catchError, EMPTY} from 'rxjs'

const ERROR_MESSAGE = 'Произошла ошибка, пожалуйста перезагрузите страницу.'

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const snackBar = inject(MatSnackBar)
  return next(request).pipe(
    catchError(() => {
      snackBar.open(ERROR_MESSAGE, 'Закрыть', {horizontalPosition: 'end', verticalPosition: 'top'})
      return EMPTY
    }),
  )
}
