import {provideZonelessChangeDetection} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {ThemeStore} from './theme.store'

const STORAGE_KEY = 'kanban-theme'

describe('ThemeStore', () => {
  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY)
    document.documentElement.classList.remove('theme-dark')
    vi.unstubAllGlobals()
  })

  function media(matches: boolean) {
    const listeners = new Set<(event: MediaQueryListEvent) => void>()
    const query = {
      matches,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener)
      },
    }
    vi.stubGlobal('matchMedia', () => query)
    return {
      change(next: boolean) {
        query.matches = next
        for (const listener of listeners) {
          listener({matches: next} as MediaQueryListEvent)
        }
      },
    }
  }

  function store(): ThemeStore {
    TestBed.configureTestingModule({providers: [provideZonelessChangeDetection()]})
    return TestBed.inject(ThemeStore)
  }

  it('follows the system theme until the user chooses one', () => {
    const system = media(true)

    const theme = store()

    expect(theme.isDark()).toBe(true)
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true)

    system.change(false)

    expect(theme.isDark()).toBe(false)
    expect(document.documentElement.classList.contains('theme-dark')).toBe(false)
  })

  it('keeps the chosen theme and ignores later system changes', () => {
    const system = media(false)
    const theme = store()

    theme.toggle()

    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
    expect(theme.isDark()).toBe(true)
    system.change(false)
    expect(theme.isDark()).toBe(true)

    TestBed.resetTestingModule()
    expect(store().isDark()).toBe(true)
  })
})
