import {Component, Input, OnInit} from "@angular/core";
import {TaskList} from "../../models/task-list";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Task} from "../../models/task";
import {Colors} from "../../models/colors";
import {TaskListService} from "../../services/task-list.service";
import {ColumnComponent} from "../column/column.component";
import {TaskService} from "../../services/task.service";

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['../../app.component.css']
})
export class TaskListComponent implements OnInit {

    @Input() taskList: TaskList
    @Input() taskDropLists: string[]
    @Input() colors: Colors[]
    @Input() columnComponent: ColumnComponent

    constructor(private taskListService: TaskListService,
                private taskService: TaskService) {
    }

    ngOnInit(): void {
        this.taskDropLists.push(this.taskList.id)
    }

    renameTaskList(name: string) {
        this.taskList.name = name
        if (this.taskList.id != "") {
            this.taskListService.renameTaskList(this.taskList.id, name)
        } else {
            this.taskListService.createTaskList(this.columnComponent.column.id, name, this.taskList.position).subscribe(data => {
                this.taskList.id = data.id
                this.columnComponent.projectComponent.taskDropLists.push(data.id)
            })
        }
    }

    changeTaskListColor(color: number) {
        this.taskList.color = color
        if (this.taskList.id != "") {
            this.taskListService.changeTaskListColor(this.taskList.id, color)
        }
    }

    newTask() {
        this.taskList.tasks.push(new Task("", "", false, this.taskList.tasks.length))
    }

    moveTask(event: CdkDragDrop<Task[]>) {
        event.previousContainer.data[event.previousIndex].position = event.currentIndex
        this.taskService.moveTask(event.previousContainer.data[event.previousIndex].id,
            event.previousContainer.id, event.previousIndex, this.taskList.id, event.currentIndex)
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

    public deleteTaskList() {
        if (this.taskList.id != "") {
            this.taskListService.deleteTaskList(this.taskList.id, this.columnComponent.column.id, this.taskList.position)
        }
        this.columnComponent.column.taskLists.splice(this.columnComponent.column.taskLists.indexOf(this.taskList), 1)
    }

    keyPressed(taskComponent: HTMLElement, event: KeyboardEvent, value: string) {
        if (event.key == "Enter" && event.ctrlKey) {
            if (value != "") {
                this.newTask()
            }
        } else if (event.key == "Escape") {
            if (value == "") {
                this.deleteTaskList()
            }
            taskComponent.blur()
        }
    }
}
