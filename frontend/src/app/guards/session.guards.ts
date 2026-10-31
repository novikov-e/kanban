import {inject} from '@angular/core'
import {CanActivateFn, Router} from '@angular/router'
import {catchError, map, of, switchMap} from 'rxjs'
import {AuthService} from '../services/auth.service'
import {UserStore} from '../state/user.store'

export const LOGIN_PATH = 'login'

/** Пускает в приложение с восстановленной сессией и загруженным пользователем; иначе — на страницу входа. */
export const authGuard: CanActivateFn = (_, state) => {
  const router = inject(Router)
  const userStore = inject(UserStore)
  return inject(AuthService)
    .restoreSession()
    .pipe(
      switchMap(authenticated => {
        if (!authenticated) {
          return of(router.createUrlTree([LOGIN_PATH], {queryParams: {returnUrl: state.url}}))
        }
        if (userStore.user()) {
          return of(true)
        }
        return userStore.load().pipe(
          map(() => true),
          catchError(() => of(false)),
        )
      }),
    )
}

export const guestGuard: CanActivateFn = () => {
  const home = inject(Router).createUrlTree(['/'])
  return inject(AuthService)
    .restoreSession()
    .pipe(map(authenticated => (authenticated ? home : true)))
}

export const lastBoardGuard: CanActivateFn = () => {
  const lastBoard = inject(UserStore).user()?.lastBoard
  return lastBoard ? inject(Router).createUrlTree(['/boards', lastBoard]) : true
}
