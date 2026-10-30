import {Component, OnInit} from '@angular/core';
import {Project} from "./models/project";
import {UserService} from "./services/user.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {User} from "./models/user";
import {Colors} from "./models/colors";
import {lightTheme} from "./data/light-theme";
import {darkTheme} from "./data/dark-theme";
import {ProjectService} from "./services/project.service";
import {Column} from "./models/column";
import {Observable} from "rxjs";
import {ErrorService} from "./services/error.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string = "stack check"
  user: User
  project: Project | null
  colors: Colors[] = lightTheme
  columnDropLists: string[] = []
  taskListDropLists: string[] = []
  taskDropLists: string[] = []

  constructor(private userService: UserService,
              private projectService: ProjectService,
              public errorService: ErrorService,
              private _snackBar: MatSnackBar) {
    this.errorService.error$.subscribe({next: (message) => {
      if (message) {
        this.openSnackBar("Произошла ошибка, пожалуйста перезагрузите страницу.", "Закрыть")
      }
    }})
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(data => {
      this.user = data
      if (data.darkTheme) {
        this.colors = darkTheme
      }
      if (data.lastProject != null) {
        this.openProject(data.lastProject)
      }
    })
  }

  newProject() {
    let project: Observable<Project> = this.projectService.createProject(this.user.id, this.user.projects.length)
    project.subscribe(data => {
      this.user.projects.push(data)
      this.project = data
      this.user.lastProject = data.id
      this.userService.lastProject(this.user.id, data.id)
    })
  }

  openProject(id: string) {
    if (this.project?.id != id) {
      this.project = null
      this.projectService.getProjectById(id).subscribe(data => this.project = data)
      this.user.lastProject = id
      this.userService.lastProject(this.user.id, id)
    }
  }

  closeProject() {
    this.project = null
    this.user.lastProject = null
    this.userService.lastProject(this.user.id, null)
    this.columnDropLists = []
  }

  renameProject(projectId: string, projectName: string) {
    for (let i = 0; i < this.user.projects.length; i++) {
      if (this.user.projects[i].id == projectId) {
        this.user.projects[i].name = projectName
      }
    }
    this.projectService.renameProject(projectId, projectName)
  }

  moveProject(event: CdkDragDrop<Project[]>) {
    this.projectService.moveProject(this.user.projects[event.previousIndex].id,
      this.user.id, event.previousIndex, this.user.id, event.currentIndex)
    moveItemInArray(this.user.projects, event.previousIndex, event.currentIndex);
  }

  deleteProject(projectId: string, projectPosition: number) {
    if (this.project?.id == projectId) {
      this.project = null
      this.user.lastProject = null
      this.userService.lastProject(this.user.id, null)
    }
    this.projectService.deleteProject(this.user.id, projectId, projectPosition)
    for (let i = 0; i < this.user.projects.length; i++) {
      if (this.user.projects[i].id == projectId) {
        this.user.projects.splice(i, 1)
      }
    }
  }

  newColumn() {
    this.project?.columns.push(new Column("", "", this.project?.columns.length))
  }

  changeTheme() {
    if (!this.user.darkTheme) {
      this.colors = darkTheme
    } else {
      this.colors = lightTheme
    }
    this.user.darkTheme = !this.user.darkTheme
    this.userService.darkTheme(this.user.id, this.user.darkTheme)
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top'});
    this._snackBar._openedSnackBarRef?.afterDismissed().subscribe(() => this.actionSnackBar())
  }

  actionSnackBar() {
    console.log("ACTION!!!")
  }
}
