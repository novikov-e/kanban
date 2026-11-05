import {BoardSummary} from './board'

export interface User {
  readonly id: string
  readonly firstname: string | null
  readonly lastname: string | null
  readonly dateOfBirth: string | null
  readonly sex: string | null
  readonly image: string | null
  readonly email: string
  readonly lastBoard: string | null
  readonly boards: readonly BoardSummary[]
}

/** Поля профиля, которые принимает `PATCH /users/me`. Пустая строка на сервер не уходит: необязательные поля — null. */
export interface ProfileUpdate {
  readonly firstname: string | null
  readonly lastname: string | null
  readonly dateOfBirth: string | null
  readonly sex: string | null
  readonly image: string | null
  readonly email: string
}
