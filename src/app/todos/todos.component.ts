import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AddTodosComponent } from './add-todos/add-todos.component';
import { PendingTodosComponent } from './pending-todos/pending-todos.component';
import { CompletedTodosComponent } from './completed-todos/completed-todos.component';
import TodoService from '../firebase/todo.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-todos',
  imports: [
    AddTodosComponent,
    PendingTodosComponent,
    CompletedTodosComponent,
    SpinnerComponent,
  ],
  templateUrl: './todos.component.html',
})
export class TodosComponent implements OnInit {
  private todoService = inject(TodoService);
  private destroyRef = inject(DestroyRef);
  isLoading = this.todoService.isLoading;

  ngOnInit(): void {
    const subscription = this.todoService.getTodos$().subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
