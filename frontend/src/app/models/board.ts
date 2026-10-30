import {Column} from "./column";

export class Board {
  id: string
  name: string
  position: number
  columns: Column[]

  constructor(id: string, name: string, position: number) {
    this.id = id
    this.name = name
    this.position = position
    this.columns = []
  }
}
