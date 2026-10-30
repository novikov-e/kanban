import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  error$ = new Subject<string>()
  handle(message: string) {
    this.error$.next(message)
    console.log(message)
  }

  clear() {
    this.error$.next('')
  }
}
