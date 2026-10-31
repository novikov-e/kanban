import {Component, Input, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {Task} from "../../models/task";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Subtask} from "../../models/subtask";
import {Colors} from "../../models/colors";
import {TaskService} from "../../services/task.service";
import {ColumnComponent} from "../column/column.component";
import {SubtaskService} from "../../services/subtask.service";

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['../../app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TaskComponent implements OnInit {

    @Input() task: Task
    @Input() subtaskDropLists: string[]
    @Input() colors: Colors[]
    @Input() columnComponent: ColumnComponent

    constructor(private taskService: TaskService,
                private subtaskService: SubtaskService) {
    }

    ngOnInit(): void {
        this.subtaskDropLists.push(this.task.id)
    }

    renameTask(name: string) {
        this.task.name = name
        if (this.task.id != "") {
            this.taskService.renameTask(this.task.id, name)
        } else {
            this.taskService.createTask(this.columnComponent.column.id, name, this.task.position).subscribe(data => {
                this.task.id = data.id
                this.columnComponent.boardComponent.subtaskDropLists.push(data.id)
            })
        }
    }

    changeTaskColor(color: number) {
        this.task.color = color
        if (this.task.id != "") {
            this.taskService.changeTaskColor(this.task.id, color)
        }
    }

    newSubtask() {
        this.task.subtasks.push(new Subtask("", "", false, this.task.subtasks.length))
    }

    moveSubtask(event: CdkDragDrop<Subtask[]>) {
        event.previousContainer.data[event.previousIndex].position = event.currentIndex
        this.subtaskService.moveSubtask(event.previousContainer.data[event.previousIndex].id,
            event.previousContainer.id, event.previousIndex, this.task.id, event.currentIndex)
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }

    public deleteTask() {
        if (this.task.id != "") {
            this.taskService.deleteTask(this.task.id, this.columnComponent.column.id, this.task.position)
        }
        this.columnComponent.column.tasks.splice(this.columnComponent.column.tasks.indexOf(this.task), 1)
    }

    keyPressed(taskElement: HTMLElement, event: KeyboardEvent, value: string) {
        if (event.key == "Enter" && event.ctrlKey) {
            if (value != "") {
                this.newSubtask()
            }
        } else if (event.key == "Escape") {
            if (value == "") {
                this.deleteTask()
            }
            taskElement.blur()
        }
    }
}
