import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {SubtaskComponent} from "./components/subtask/subtask.component";
import {TaskComponent} from "./components/task/task.component";
import {ColumnComponent} from "./components/column/column.component";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {TextFieldModule} from "@angular/cdk/text-field";
import {MatInputModule} from "@angular/material/input";
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {ButtonHoverDirective} from './directives/button-hover.directive';
import {BoardComponent} from "./components/board/board.component";
import {TextButtonDirective} from "./directives/text-button.directive";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { FocusDirective } from './directives/focus.directive';
import { SelectDirective } from './directives/select.directive';

@NgModule({ declarations: [
        AppComponent,
        SubtaskComponent,
        TaskComponent,
        ColumnComponent,
        BoardComponent,
        ButtonHoverDirective,
        TextButtonDirective,
        TextButtonDirective,
        FocusDirective,
        SelectDirective,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatButtonModule,
        MatGridListModule,
        CdkDropList,
        TextFieldModule,
        MatInputModule,
        CdkMenuTrigger,
        CdkMenu,
        CdkMenuItem,
        CdkDrag,
        CdkDropListGroup,
        MatSlideToggleModule,
        FormsModule,
        MatSnackBarModule], providers: [
        MatSnackBarModule,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {
}
