import {TaskList} from "./task-list";

export class Column {
  id: string
  name: string
  position: number
  taskLists: TaskList[]

  constructor(id: string, name: string, position: number) {
    this.id = id
    this.name = name
    this.position = position
    this.taskLists = []
  }
}
