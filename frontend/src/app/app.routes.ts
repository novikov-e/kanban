import {Routes} from '@angular/router'
import {BoardPageComponent} from './components/board-page/board-page.component'
import {LoginComponent} from './components/login/login.component'
import {WorkspaceComponent} from './components/workspace/workspace.component'
import {authGuard, guestGuard, lastBoardGuard, LOGIN_PATH} from './guards/session.guards'

export const routes: Routes = [
  {path: LOGIN_PATH, component: LoginComponent, canActivate: [guestGuard]},
  {
    path: '',
    component: WorkspaceComponent,
    canActivate: [authGuard],
    children: [
      {path: '', pathMatch: 'full', canActivate: [lastBoardGuard], children: []},
      {path: 'boards/:boardId', component: BoardPageComponent},
    ],
  },
  {path: '**', redirectTo: ''},
]
