import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http'
import {ChangeDetectionStrategy, Component, inject, input, signal} from '@angular/core'
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {AuthService} from '../../services/auth.service'

const MIN_PASSWORD_LENGTH = 8

const ERRORS: Partial<Record<number, string>> = {
  [HttpStatusCode.Unauthorized]: 'Неверный email или пароль',
  [HttpStatusCode.Conflict]: 'Этот email уже зарегистрирован',
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  private auth = inject(AuthService)
  private router = inject(Router)

  /** Куда вернуться после входа: страница, с которой guard перенаправил на вход. */
  readonly returnUrl = input<string>('/')

  protected readonly minPasswordLength = MIN_PASSWORD_LENGTH
  protected readonly registering = signal(false)
  protected readonly error = signal<string | null>(null)
  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]],
  })

  toggleMode() {
    this.registering.update(registering => !registering)
    this.error.set(null)
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    const credentials = this.form.getRawValue()
    const request$ = this.registering() ? this.auth.register(credentials) : this.auth.login(credentials)
    request$.subscribe({
      next: () => void this.router.navigateByUrl(this.returnUrl()),
      error: (error: HttpErrorResponse) => this.error.set(ERRORS[error.status] ?? 'Не удалось выполнить вход'),
    })
  }
}
