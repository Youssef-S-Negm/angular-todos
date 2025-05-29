import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AddTodosComponent } from './add-todos/add-todos.component';
import { PendingTodosComponent } from './pending-todos/pending-todos.component';
import { CompletedTodosComponent } from './completed-todos/completed-todos.component';
import TodosService from './todos.service';

@Component({
  selector: 'app-todos',
  imports: [AddTodosComponent, PendingTodosComponent, CompletedTodosComponent],
  templateUrl: './todos.component.html',
})
export class TodosComponent implements OnInit {
  private todoService = inject(TodosService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.todoService.getTodos$().subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
