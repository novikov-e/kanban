import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {TestBed} from '@angular/core/testing'
import {Router} from '@angular/router'
import {RouterTestingHarness} from '@angular/router/testing'
import {appConfig} from './app.config'
import {User} from './models/user'
import {makeBoard} from './testing/fixtures'

const user: User = {
  id: 'user-1',
  firstname: 'Егор',
  lastname: 'Новиков',
  dateOfBirth: '1990-01-31',
  sex: 'M',
  image: '',
  email: 'user@example.com',
  darkTheme: false,
  lastBoard: null,
  boards: [makeBoard('board-1', 'Первая доска'), makeBoard('board-2', 'Вторая доска')],
}

const settle = () => new Promise(resolve => setTimeout(resolve))

describe('App routes', () => {
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [...appConfig.providers, provideHttpClientTesting()]})
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  async function startWithSession(url: string, sessionUser: User) {
    const created = RouterTestingHarness.create(url)
    await settle()
    httpMock.expectOne({method: 'POST', url: '/api/v1/auth/refresh'}).flush({accessToken: 'access-token'})
    await settle()
    const userRequest = httpMock.expectOne({method: 'GET', url: '/api/v1/users/me'})
    expect(userRequest.request.headers.get('Authorization')).toBe('Bearer access-token')
    userRequest.flush(sessionUser)
    const harness = await created
    harness.detectChanges()
    return harness
  }

  const page = (harness: RouterTestingHarness) => harness.fixture.nativeElement as HTMLElement
  const boardTitle = (harness: RouterTestingHarness) =>
    (page(harness).querySelector('.header input') as HTMLInputElement).value

  it('sends a visitor without a session to the login form and remembers the requested page', async () => {
    const created = RouterTestingHarness.create('/boards/board-1')
    await settle()
    httpMock
      .expectOne('/api/v1/auth/refresh')
      .flush({detail: 'Refresh token is missing'}, {status: 401, statusText: 'Unauthorized'})
    const harness = await created
    harness.detectChanges()

    expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Fboards%2Fboard-1')
    expect(page(harness).querySelector('app-login form')).not.toBeNull()
  })

  it('restores the session and lists the boards in the menu', async () => {
    const harness = await startWithSession('/', user)

    const menu = page(harness).querySelector('.list_boards') as HTMLElement
    expect(menu.textContent).toContain('Первая доска')
    expect(menu.textContent).toContain('Вторая доска')
  })

  it('opens the last board of the user', async () => {
    const harness = await startWithSession('/', {...user, lastBoard: 'board-2'})

    httpMock.expectOne({method: 'GET', url: '/api/v1/boards/board-2'}).flush(makeBoard('board-2', 'Вторая доска'))
    harness.detectChanges()

    expect(TestBed.inject(Router).url).toBe('/boards/board-2')
    expect(boardTitle(harness)).toBe('Вторая доска')
  })

  it('opens the board from the address and remembers it as the last one', async () => {
    const harness = await startWithSession('/boards/board-1', user)

    httpMock.expectOne({method: 'GET', url: '/api/v1/boards/board-1'}).flush(makeBoard('board-1', 'Первая доска'))
    harness.detectChanges()

    expect(boardTitle(harness)).toBe('Первая доска')
    const remember = httpMock.expectOne({method: 'PATCH', url: '/api/v1/users/me'})
    expect(remember.request.body).toEqual({lastBoardId: 'board-1'})
    remember.flush(null)
  })

  it('does not remember a board that failed to open', async () => {
    const harness = await startWithSession('/boards/foreign', user)

    httpMock.expectOne('/api/v1/boards/foreign').flush(null, {status: 404, statusText: 'Not Found'})
    harness.detectChanges()

    httpMock.expectNone({method: 'PATCH', url: '/api/v1/users/me'})
    expect(page(harness).querySelector('app-board')).toBeNull()
    await vi.waitFor(() => expect(document.querySelector('.mat-mdc-snack-bar-label')).not.toBeNull())
  })

  it('refreshes the open board when the tab becomes visible and the board has changed', async () => {
    const harness = await startWithSession('/', {...user, lastBoard: 'board-2'})
    httpMock.expectOne('/api/v1/boards/board-2').flush(makeBoard('board-2', 'Вторая доска'), {
      headers: {ETag: '"v1"'},
    })
    harness.detectChanges()

    document.dispatchEvent(new Event('visibilitychange'))
    const unchanged = httpMock.expectOne('/api/v1/boards/board-2')
    expect(unchanged.request.headers.get('If-None-Match')).toBe('"v1"')
    unchanged.flush(null, {status: 304, statusText: 'Not Modified'})
    harness.detectChanges()
    expect(boardTitle(harness)).toBe('Вторая доска')

    document.dispatchEvent(new Event('visibilitychange'))
    httpMock
      .expectOne('/api/v1/boards/board-2')
      .flush(makeBoard('board-2', 'Переименована в другой вкладке'), {headers: {ETag: '"v2"'}})
    harness.detectChanges()
    expect(boardTitle(harness)).toBe('Переименована в другой вкладке')
  })
})
