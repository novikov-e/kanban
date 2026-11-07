import {HttpErrorResponse, HttpInterceptorFn, HttpStatusCode} from '@angular/common/http'
import {inject, Injector} from '@angular/core'
import {catchError, throwError} from 'rxjs'
import {AUTH_URL} from '../services/auth.service'

const ERROR_MESSAGE = $localize`:@@error.request:Не удалось выполнить запрос к серверу.`
const CLOSE_ACTION = $localize`:@@error.close:Закрыть`

/** Для подписок, которым нечего откатывать: об ошибке пользователю уже сообщил перехватчик. */
export const errorAlreadyReported = (): void => undefined

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.startsWith(AUTH_URL)) {
    return next(request)
  }
  const injector = inject(Injector)
  return next(request).pipe(
    catchError(error => {
      if (!(error instanceof HttpErrorResponse) || error.status !== HttpStatusCode.NotModified) {
        showError(injector)
      }
      return throwError(() => error)
    }),
  )
}

function showError(injector: Injector): void {
  void import('@angular/material/snack-bar').then(({MatSnackBar}) =>
    injector.get(MatSnackBar).open(ERROR_MESSAGE, CLOSE_ACTION, {horizontalPosition: 'end', verticalPosition: 'top'}),
  )
}
