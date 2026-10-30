import {Subtask} from "./subtask";

export class Task {
  id: string
  name: string
  position: number
  color: number
  subtasks: Subtask[]

  constructor(id: string, name: string, position: number, color: number) {
    this.id = id
    this.name = name
    this.position = position
    this.color = color
    this.subtasks = []
  }
}
