import {Task} from "./task";

export class TaskList {
  id: string
  name: string
  position: number
  color: number
  tasks: Task[]

  constructor(id: string, name: string, position: number, color: number) {
    this.id = id
    this.name = name
    this.position = position
    this.color = color
    this.tasks = []
  }
}
