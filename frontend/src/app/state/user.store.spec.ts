import {provideHttpClient} from '@angular/common/http'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {provideZonelessChangeDetection} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {User} from '../models/user'
import {UserStore} from './user.store'

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
  boards: [],
}

describe('UserStore', () => {
  let store: UserStore
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    })
    store = TestBed.inject(UserStore)
    httpMock = TestBed.inject(HttpTestingController)
    store.load().subscribe()
    httpMock.expectOne('/api/v1/users/me').flush(user)
  })

  afterEach(() => httpMock.verify())

  it('switches the theme immediately and restores it when the server rejects the change', () => {
    store.toggleTheme()
    expect(store.user()!.darkTheme).toBe(true)

    httpMock
      .expectOne({method: 'PATCH', url: '/api/v1/users/me'})
      .flush(null, {status: 500, statusText: 'Server Error'})
    httpMock.expectOne({method: 'GET', url: '/api/v1/users/me'}).flush(user)

    expect(store.user()!.darkTheme).toBe(false)
  })
})
