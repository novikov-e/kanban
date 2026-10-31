import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Компоненты меняют модели на месте (push/splice), поэтому приложение остаётся на zone.js
    provideZoneChangeDetection(),
    provideHttpClient(),
  ],
};
