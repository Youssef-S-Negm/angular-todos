import { Component, DestroyRef, inject, input } from '@angular/core';
import Todo, { Priority, Status } from '../../models/todo.model';
import TodosService from '../todos.service';

@Component({
  selector: 'app-todo',
  imports: [],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent {
  todo = input.required<Todo>();
  private todoService = inject(TodosService);
  private destroyRef = inject(DestroyRef);

  onChangeStatus() {
    const newStatus: Status =
      this.todo().status === 'pending' ? 'done' : 'pending';

    const subscription = this.todoService
      .updateTodoStatus$(this.todo(), newStatus)
      .subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onChangePriority() {
    const newPriority: Priority = Number(this.todo().priority) === 1 ? 2 : 1;

    const subscription = this.todoService
      .updateTodoPriority$(this.todo(), newPriority)
      .subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
