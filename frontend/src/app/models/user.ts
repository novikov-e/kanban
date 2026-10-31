import {BoardSummary} from './board'

export interface User {
  readonly id: string
  readonly firstname: string
  readonly lastname: string
  readonly dateOfBirth: string
  readonly sex: string
  readonly image: string
  readonly email: string
  readonly darkTheme: boolean
  readonly lastBoard: string | null
  readonly boards: readonly BoardSummary[]
}
