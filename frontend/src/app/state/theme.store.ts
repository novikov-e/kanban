import {DOCUMENT} from '@angular/common'
import {inject, Injectable, signal} from '@angular/core'

/** Класс на <html>, переключающий палитру в styles.css. Ключ дублируется в index.html. */
const STORAGE_KEY = 'kanban-theme'
const DARK_CLASS = 'theme-dark'

@Injectable({providedIn: 'root'})
export class ThemeStore {
  private readonly document = inject(DOCUMENT)
  private readonly dark = signal(storedTheme() ?? systemDark())

  readonly isDark = this.dark.asReadonly()

  constructor() {
    this.apply(this.dark())
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', event => {
      if (storedTheme() === null) {
        this.dark.set(event.matches)
        this.apply(event.matches)
      }
    })
  }

  toggle(): void {
    const next = !this.dark()
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // Выбор всё равно действует в этой вкладке, если хранилище недоступно.
    }
    this.dark.set(next)
    this.apply(next)
  }

  private apply(dark: boolean): void {
    this.document.documentElement.classList.toggle(DARK_CLASS, dark)
  }
}

function storedTheme(): boolean | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'dark' || value === 'light') {
      return value === 'dark'
    }
  } catch {
    return null
  }
  return null
}

function systemDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}
