import { Component } from '@angular/core';
import { AddTodosComponent } from './add-todos/add-todos.component';
import { PendingTodosComponent } from "./pending-todos/pending-todos.component";
import { CompletedTodosComponent } from "./completed-todos/completed-todos.component";

@Component({
  selector: 'app-todos',
  imports: [AddTodosComponent, PendingTodosComponent, CompletedTodosComponent],
  templateUrl: './todos.component.html',
})
export class TodosComponent {}
