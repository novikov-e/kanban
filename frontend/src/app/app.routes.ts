import {Routes} from '@angular/router'
import {authGuard, guestGuard, lastBoardGuard, LOGIN_PATH} from './guards/session.guards'

export const routes: Routes = [
  {
    path: LOGIN_PATH,
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: '',
    loadComponent: () => import('./components/workspace/workspace.component').then(m => m.WorkspaceComponent),
    canActivate: [authGuard],
    children: [
      {path: '', pathMatch: 'full', canActivate: [lastBoardGuard], children: []},
      {
        path: 'boards',
        pathMatch: 'full',
        loadComponent: () => import('./components/boards-page/boards-page.component').then(m => m.BoardsPageComponent),
      },
      {
        path: 'boards/:boardId',
        loadComponent: () => import('./components/board-page/board-page.component').then(m => m.BoardPageComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
      },
    ],
  },
  {path: '**', redirectTo: ''},
]
