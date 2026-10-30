import {Component, Input, OnInit} from "@angular/core";
import {Column} from "../../models/column";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {TaskList} from "../../models/task-list";
import {Colors} from "../../models/colors";
import {ColumnService} from "../../services/column.service";
import {ProjectComponent} from "../project/project.component";
import {TaskListService} from "../../services/task-list.service";

@Component({
    selector: 'app-column',
    templateUrl: './column.component.html',
    styleUrls: ['../../app.component.css']
})
export class ColumnComponent implements OnInit {

    @Input() column: Column
    @Input() taskListDropLists: string[]
    @Input() taskDropLists: string[]
    @Input() colors: Colors[]
    @Input() projectComponent: ProjectComponent

    constructor(private columnService: ColumnService,
                private taskListService: TaskListService) {
    }

    ngOnInit(): void {
        this.taskListDropLists.push(this.column.id)
    }

    renameColumn(name: string) {
        this.column.name = name
        if (this.column.id != "") {
            this.columnService.renameColumn(this.column.id, name)
        } else {
            this.columnService.createColumn(this.projectComponent.project.id, name, this.column.position)
                .subscribe(data => {
                    this.column.id = data.id
                    this.taskListDropLists.push(data.id)
                })
        }
    }

    deleteColumn() {
        if (this.column.id != "") {
            this.columnService.deleteColumn(this.column.id, this.projectComponent.project.id, this.column.position)
        }
        this.projectComponent.project.columns.splice(this.projectComponent.project.columns.indexOf(this.column), 1)
    }

    newTaskList() {
        this.column.taskLists.push(new TaskList("", "", this.column.taskLists.length, 1))
    }

    moveTaskList(event: CdkDragDrop<TaskList[]>) {
        event.previousContainer.data[event.previousIndex].position = event.currentIndex
        this.taskListService.moveTaskList(event.previousContainer.data[event.previousIndex].id,
            event.previousContainer.id, event.previousIndex, this.column.id, event.currentIndex)
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

    keyPressed(taskComponent: HTMLElement, event: KeyboardEvent, value: string) {
        if (event.key == "Escape") {
            if (value == "") {
                this.deleteColumn()
            }
            taskComponent.blur()
        }
    }
}
