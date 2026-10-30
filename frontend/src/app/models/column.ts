import {Task} from "./task";

export class Column {
  id: string
  name: string
  position: number
  tasks: Task[]

  constructor(id: string, name: string, position: number) {
    this.id = id
    this.name = name
    this.position = position
    this.tasks = []
  }
}
