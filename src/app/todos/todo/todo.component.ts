import { Component, DestroyRef, inject, input } from '@angular/core';
import Todo, { Status } from '../../models/todo.model';
import TodoService from '../../firebase/todo.service';

@Component({
  selector: 'app-todo',
  imports: [],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent {
  todo = input.required<Todo>();
  private todoService = inject(TodoService);
  private destroyRef = inject(DestroyRef);

  onChangeStatus() {
    const newStatus: Status =
      this.todo().status === 'pending' ? 'done' : 'pending';

    const subscription = this.todoService
      .updateTodoStatus$(this.todo(), newStatus)
      .subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
