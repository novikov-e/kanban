export class Task {
  id: string
  name: string
  state: boolean
  position: number

  constructor(id: string, name: string, state: boolean, position: number) {
    this.id = id
    this.name = name
    this.state = state
    this.position = position
  }
}
