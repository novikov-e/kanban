import {TestBed} from '@angular/core/testing'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {AppComponent} from './app.component'
import {appConfig} from './app.config'
import {Board} from './models/board'
import {User} from './models/user'

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
  boards: [new Board('board-1', 'Первая доска', 0), new Board('board-2', 'Вторая доска', 1)],
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

    const boardRequest = httpMock.expectOne({method: 'GET', url: '/api/v1/boards/board-2'})
    const lastBoardRequest = httpMock.expectOne({method: 'PATCH', url: '/api/v1/users/me'})
    expect(lastBoardRequest.request.body).toEqual({lastBoardId: 'board-2'})

    boardRequest.flush(new Board('board-2', 'Вторая доска', 1))
    lastBoardRequest.flush(null)
    fixture.detectChanges()

    const title = fixture.nativeElement.querySelector('.header input') as HTMLInputElement
    expect(title.value).toBe('Вторая доска')
  })
})
