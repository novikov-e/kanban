import {Component, Input} from "@angular/core";
import {Subtask} from "../../models/subtask";
import {Colors} from "../../models/colors";
import {SubtaskService} from "../../services/subtask.service";
import {TaskComponent} from "../task/task.component";

@Component({
    selector: 'app-subtask',
    templateUrl: './subtask.component.html',
    styleUrls: ['../../app.component.css'],
    standalone: false
})
export class SubtaskComponent {

    @Input() subtask: Subtask
    @Input() color: Colors
    @Input() taskComponent: TaskComponent

    constructor(private subtaskService: SubtaskService) {
    }

    renameSubtask(name: string) {
        this.subtask.name = name
        if (this.subtask.id != "") {
            this.subtaskService.renameSubtask(this.subtask.id, name)
        } else {
            this.subtaskService.createSubtask(this.taskComponent.task.id, name, this.subtask.position).subscribe(data => {
                this.subtask.id = data.id
            })
        }
    }

    changeSubtaskState() {
        this.subtask.state = !this.subtask.state
        if (this.subtask.id != "") {
            this.subtaskService.changeSubtaskState(this.subtask.id, this.subtask.state)
        }
    }

    deleteSubtask() {
        this.taskComponent.task.subtasks.splice(this.taskComponent.task.subtasks.indexOf(this.subtask), 1)
        if (this.subtask.id != "") {
            this.subtaskService.deleteSubtask(this.subtask.id, this.taskComponent.task.id, this.subtask.position)
        }
    }

    keyPressed(subtaskElement: HTMLElement, event: KeyboardEvent, value: string) {
        if (event.key == "Enter" && event.ctrlKey) {
            if (value != "") {
                this.taskComponent.newSubtask()
            }
        } else if (event.key == "Escape") {
            if (value == "") {
                this.deleteSubtask()
            }
            subtaskElement.blur()
        }
    }
}
