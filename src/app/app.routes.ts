import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { routes as AuthRoutes } from './auth/auth.routes';
import { authGuard } from './auth/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  {
    path: 'todos',
    loadComponent: () =>
      import('./todos/todos.component').then((module) => module.TodosComponent),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: AuthRoutes,
  },
];
