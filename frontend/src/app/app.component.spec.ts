import {TestBed} from '@angular/core/testing'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {AppComponent} from './app.component'
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

describe('AppComponent', () => {
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...appConfig.providers, provideHttpClientTesting()],
    })
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  function startWithSession(sessionUser: User) {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    httpMock.expectOne({method: 'POST', url: '/api/v1/auth/refresh'}).flush({accessToken: 'access-token'})
    const userRequest = httpMock.expectOne({method: 'GET', url: '/api/v1/users/me'})
    expect(userRequest.request.headers.get('Authorization')).toBe('Bearer access-token')
    userRequest.flush(sessionUser)
    fixture.detectChanges()
    return fixture
  }

  it('shows the login form when there is no session', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()

    httpMock
      .expectOne('/api/v1/auth/refresh')
      .flush({detail: 'Refresh token is missing'}, {status: 401, statusText: 'Unauthorized'})
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('app-login form')).not.toBeNull()
    expect(fixture.nativeElement.querySelector('.app')).toBeNull()
  })

  it('restores the session and lists the boards in the menu', () => {
    const fixture = startWithSession(user)

    const menu = fixture.nativeElement.querySelector('.list_boards') as HTMLElement
    expect(menu.textContent).toContain('Первая доска')
    expect(menu.textContent).toContain('Вторая доска')
  })

  it('opens the last board of the user', () => {
    const fixture = startWithSession({...user, lastBoard: 'board-2'})

    httpMock.expectOne({method: 'GET', url: '/api/v1/boards/board-2'}).flush(makeBoard('board-2', 'Вторая доска'))
    fixture.detectChanges()

    const title = fixture.nativeElement.querySelector('.header input') as HTMLInputElement
    expect(title.value).toBe('Вторая доска')
  })

  it('refreshes the open board when the tab becomes visible and the board has changed', () => {
    const fixture = startWithSession({...user, lastBoard: 'board-2'})
    httpMock.expectOne('/api/v1/boards/board-2').flush(makeBoard('board-2', 'Вторая доска'), {
      headers: {ETag: '"v1"'},
    })
    fixture.detectChanges()
    const title = () => (fixture.nativeElement.querySelector('.header input') as HTMLInputElement).value

    document.dispatchEvent(new Event('visibilitychange'))
    const unchanged = httpMock.expectOne('/api/v1/boards/board-2')
    expect(unchanged.request.headers.get('If-None-Match')).toBe('"v1"')
    unchanged.flush(null, {status: 304, statusText: 'Not Modified'})
    fixture.detectChanges()
    expect(title()).toBe('Вторая доска')

    document.dispatchEvent(new Event('visibilitychange'))
    httpMock
      .expectOne('/api/v1/boards/board-2')
      .flush(makeBoard('board-2', 'Переименована в другой вкладке'), {headers: {ETag: '"v2"'}})
    fixture.detectChanges()
    expect(title()).toBe('Переименована в другой вкладке')
  })
})
