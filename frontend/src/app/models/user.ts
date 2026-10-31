import {Board} from './board'

export interface User {
  id: string
  firstname: string
  lastname: string
  dateOfBirth: string
  sex: string
  image: string
  email: string
  darkTheme: boolean
  lastBoard: string | null
  boards: Board[]
}
