import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../models/project";
import {Colors} from "../../models/colors";
import {Column} from "../../models/column";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {AppComponent} from "../../app.component";
import {ColumnService} from "../../services/column.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['../../app.component.css']
})
export class ProjectComponent implements OnInit {

  @Input() project: Project
  @Input() colors: Colors[]
  @Input() columnDropLists: string[]
  @Input() taskListDropLists: string[]
  @Input() taskDropLists: string[]
  @Input() appComponent: AppComponent

  constructor(private columnService: ColumnService) {}

  ngOnInit(): void {
    this.columnDropLists.push(this.project.id)
  }

  moveColumn(event: CdkDragDrop<Column[]>) {
    this.columnService.moveColumn(this.project.columns[event.previousIndex].id, this.project.id,
        event.previousIndex, this.project.id, event.currentIndex)
    this.project.columns[event.previousIndex].position = event.currentIndex
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }
}
