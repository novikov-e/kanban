import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core'
import {provideHttpClient, withInterceptors} from '@angular/common/http'
import {httpErrorInterceptor} from './interceptors/http-error.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    // Компоненты меняют модели на месте (push/splice), поэтому приложение остаётся на zone.js
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
  ],
}
