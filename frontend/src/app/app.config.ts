import {ApplicationConfig, provideZonelessChangeDetection} from '@angular/core'
import {provideHttpClient, withInterceptors} from '@angular/common/http'
import {provideRouter, withComponentInputBinding} from '@angular/router'
import {routes} from './app.routes'
import {authInterceptor} from './interceptors/auth.interceptor'
import {httpErrorInterceptor} from './interceptors/http-error.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([httpErrorInterceptor, authInterceptor])),
  ],
}
