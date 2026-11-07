import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http'
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core'
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {UserStore} from '../../state/user.store'

const MIN_PASSWORD_LENGTH = 8

const PROFILE_ERRORS: Partial<Record<number, string>> = {
  [HttpStatusCode.Conflict]: $localize`:@@profile.emailTaken:Этот email уже зарегистрирован`,
}
const PASSWORD_ERRORS: Partial<Record<number, string>> = {
  [HttpStatusCode.BadRequest]: $localize`:@@profile.wrongPassword:Неверный текущий пароль`,
}
const UNKNOWN_ERROR = $localize`:@@profile.failed:Не удалось сохранить`

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class ProfileComponent {
  private readonly userStore = inject(UserStore)
  private readonly forms = inject(NonNullableFormBuilder)

  protected readonly minPasswordLength = MIN_PASSWORD_LENGTH
  protected readonly profileError = signal('')
  protected readonly passwordError = signal('')
  protected readonly profileSaving = signal(false)
  protected readonly passwordSaving = signal(false)

  protected readonly profileForm = this.forms.group({
    firstname: [this.userStore.user()?.firstname ?? ''],
    lastname: [this.userStore.user()?.lastname ?? ''],
    dateOfBirth: [this.userStore.user()?.dateOfBirth ?? ''],
    sex: [this.userStore.user()?.sex ?? ''],
    email: [this.userStore.user()?.email ?? '', [Validators.required, Validators.email]],
  })

  protected readonly passwordForm = this.forms.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]],
    confirm: ['', Validators.required],
  })

  protected passwordMismatch(): boolean {
    const {next, confirm} = this.passwordForm.getRawValue()
    return confirm.length > 0 && next !== confirm
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.profileSaving()) {
      return
    }
    const value = this.profileForm.getRawValue()
    this.profileError.set('')
    this.profileSaving.set(true)
    this.userStore
      .saveProfile({
        firstname: value.firstname.trim() || null,
        lastname: value.lastname.trim() || null,
        dateOfBirth: value.dateOfBirth || null,
        sex: value.sex || null,
        email: value.email.trim(),
      })
      .subscribe({
        next: () => this.profileSaving.set(false),
        error: error => {
          this.profileSaving.set(false)
          this.profileError.set(this.message(error, PROFILE_ERRORS))
        },
      })
  }

  savePassword(): void {
    if (this.passwordForm.invalid || this.passwordMismatch() || this.passwordSaving()) {
      return
    }
    const {current, next} = this.passwordForm.getRawValue()
    this.passwordError.set('')
    this.passwordSaving.set(true)
    this.userStore.changePassword(current, next).subscribe({
      next: () => {
        this.passwordSaving.set(false)
        this.passwordForm.reset()
      },
      error: error => {
        this.passwordSaving.set(false)
        this.passwordError.set(this.message(error, PASSWORD_ERRORS))
      },
    })
  }

  private message(error: unknown, known: Partial<Record<number, string>>): string {
    return error instanceof HttpErrorResponse ? (known[error.status] ?? UNKNOWN_ERROR) : UNKNOWN_ERROR
  }
}
