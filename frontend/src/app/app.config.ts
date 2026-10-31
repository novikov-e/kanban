import {ApplicationConfig, provideZonelessChangeDetection} from '@angular/core'
import {provideHttpClient, withInterceptors} from '@angular/common/http'
import {authInterceptor} from './interceptors/auth.interceptor'
import {httpErrorInterceptor} from './interceptors/http-error.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([httpErrorInterceptor, authInterceptor])),
  ],
}
