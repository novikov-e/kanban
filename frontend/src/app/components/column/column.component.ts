import {Component, Input, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {Column} from "../../models/column";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Task} from "../../models/task";
import {Colors} from "../../models/colors";
import {ColumnService} from "../../services/column.service";
import {BoardComponent} from "../board/board.component";
import {TaskService} from "../../services/task.service";

@Component({
    selector: 'app-column',
    templateUrl: './column.component.html',
    styleUrls: ['../../app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ColumnComponent implements OnInit {

    @Input() column: Column
    @Input() taskDropLists: string[]
    @Input() subtaskDropLists: string[]
    @Input() colors: Colors[]
    @Input() boardComponent: BoardComponent

    constructor(private columnService: ColumnService,
                private taskService: TaskService) {
    }

    ngOnInit(): void {
        this.taskDropLists.push(this.column.id)
    }

    renameColumn(name: string) {
        this.column.name = name
        if (this.column.id != "") {
            this.columnService.renameColumn(this.column.id, name)
        } else {
            this.columnService.createColumn(this.boardComponent.board.id, name, this.column.position)
                .subscribe(data => {
                    this.column.id = data.id
                    this.taskDropLists.push(data.id)
                })
        }
    }

    deleteColumn() {
        if (this.column.id != "") {
            this.columnService.deleteColumn(this.column.id, this.boardComponent.board.id, this.column.position)
        }
        this.boardComponent.board.columns.splice(this.boardComponent.board.columns.indexOf(this.column), 1)
    }

    newTask() {
        this.column.tasks.push(new Task("", "", this.column.tasks.length, 1))
    }

    moveTask(event: CdkDragDrop<Task[]>) {
        event.previousContainer.data[event.previousIndex].position = event.currentIndex
        this.taskService.moveTask(event.previousContainer.data[event.previousIndex].id,
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

    keyPressed(columnElement: HTMLElement, event: KeyboardEvent, value: string) {
        if (event.key == "Escape") {
            if (value == "") {
                this.deleteColumn()
            }
            columnElement.blur()
        }
    }
}
