import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {TaskComponent} from "./components/task/task.component";
import {TaskListComponent} from "./components/taskList/task-list.component";
import {ColumnComponent} from "./components/column/column.component";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {HttpClientModule} from "@angular/common/http";
import {TextFieldModule} from "@angular/cdk/text-field";
import {MatInputModule} from "@angular/material/input";
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {ButtonHoverDirective} from './directives/button-hover.directive';
import {ProjectComponent} from "./components/project/project.component";
import {TextButtonDirective} from "./directives/text-button.directive";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { FocusDirective } from './directives/focus.directive';
import { SelectDirective } from './directives/select.directive';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskListComponent,
    ColumnComponent,
    ProjectComponent,
    ButtonHoverDirective,
    TextButtonDirective,
    TextButtonDirective,
    FocusDirective,
    SelectDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatGridListModule,
    CdkDropList,
    HttpClientModule,
    TextFieldModule,
    MatInputModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    CdkDrag,
    CdkDropListGroup,
    MatSlideToggleModule,
    FormsModule,
    MatSnackBarModule,
  ],
  providers: [
    MatSnackBarModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
