import {Component, Input} from "@angular/core";
import {Task} from "src/app/models/task";
import {Colors} from "../../models/colors";
import {TaskService} from "../../services/task.service";
import {TaskListComponent} from "../taskList/task-list.component";

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['../../app.component.css']
})
export class TaskComponent {

    @Input() task: Task
    @Input() color: Colors
    @Input() taskListComponent: TaskListComponent

    constructor(private taskService: TaskService) {
    }

    renameTask(name: string) {
        this.task.name = name
        if (this.task.id != "") {
            this.taskService.renameTask(this.task.id, name)
        } else {
            this.taskService.createTask(this.taskListComponent.taskList.id, name, this.task.position).subscribe(data => {
                this.task.id = data.id
            })
        }
    }

    changeTaskState() {
        this.task.state = !this.task.state
        if (this.task.id != "") {
            this.taskService.changeTaskState(this.task.id, this.task.state)
        }
    }

    deleteTask() {
        this.taskListComponent.taskList.tasks.splice(this.taskListComponent.taskList.tasks.indexOf(this.task), 1)
        if (this.task.id != "") {
            this.taskService.deleteTask(this.task.id, this.taskListComponent.taskList.id, this.task.position)
        }
    }

    keyPressed(taskComponent: HTMLElement, event: KeyboardEvent, value: string) {
        if (event.key == "Enter" && event.ctrlKey) {
            if (value != "") {
                this.taskListComponent.newTask()
            }
        } else if (event.key == "Escape") {
            if (value == "") {
                this.deleteTask()
            }
            taskComponent.blur()
        }
    }
}
