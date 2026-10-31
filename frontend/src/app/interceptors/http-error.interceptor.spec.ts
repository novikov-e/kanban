import {HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors} from '@angular/common/http'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {TestBed} from '@angular/core/testing'
import {MatSnackBar} from '@angular/material/snack-bar'
import {httpErrorInterceptor} from './http-error.interceptor'

describe('httpErrorInterceptor', () => {
  const snackBar = {open: vi.fn()}
  let http: HttpClient
  let httpMock: HttpTestingController

  beforeEach(() => {
    snackBar.open.mockClear()
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        {provide: MatSnackBar, useValue: snackBar},
      ],
    })
    http = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  it('reports a failed request and passes the error on so the caller can roll back', async () => {
    let status: number | undefined
    http.patch('/api/v1/columns/column-1', {name: 'Колонка'}).subscribe({
      error: (error: HttpErrorResponse) => (status = error.status),
    })

    httpMock.expectOne('/api/v1/columns/column-1').flush(null, {status: 500, statusText: 'Server Error'})

    expect(status).toBe(500)
    await vi.waitFor(() => expect(snackBar.open).toHaveBeenCalledOnce())
  })

  it('does not report an unchanged resource', () => {
    http.get('/api/v1/boards/board-1').subscribe({error: () => undefined})

    httpMock.expectOne('/api/v1/boards/board-1').flush(null, {status: 304, statusText: 'Not Modified'})

    expect(snackBar.open).not.toHaveBeenCalled()
  })
})
