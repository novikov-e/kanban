import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {AppComponent} from './app.component';
import {appConfig} from './app.config';
import {Board} from './models/board';
import {User} from './models/user';

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
};

describe('AppComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...appConfig.providers, provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads the user and lists their boards in the menu', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    httpMock.expectOne({method: 'GET', url: '/api/v1/user'}).flush(user);
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('.list_boards') as HTMLElement;
    expect(menu.textContent).toContain('Первая доска');
    expect(menu.textContent).toContain('Вторая доска');
  });

  it('opens the last board of the user', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    httpMock.expectOne('/api/v1/user').flush({...user, lastBoard: 'board-2'});

    const boardRequest = httpMock.expectOne(req => req.url === '/api/v1/board');
    expect(boardRequest.request.params.get('id')).toBe('board-2');
    const lastBoardRequest = httpMock.expectOne({method: 'POST', url: '/api/v1/user/last_board'});
    expect(lastBoardRequest.request.body).toEqual({userId: 'user-1', boardId: 'board-2'});

    boardRequest.flush(new Board('board-2', 'Вторая доска', 1));
    lastBoardRequest.flush({status: 'success'});
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.header input') as HTMLInputElement;
    expect(title.value).toBe('Вторая доска');
  });
});
