import { Component, computed, inject } from '@angular/core';
import { TodoComponent } from '../todo/todo.component';
import TodoService from '../../firebase/todo.service';

@Component({
  selector: 'app-completed-todos',
  imports: [TodoComponent],
  templateUrl: './completed-todos.component.html',
  styleUrl: './completed-todos.component.css',
})
export class CompletedTodosComponent {
  private todoService = inject(TodoService);
  todos = computed(() =>
    this.todoService.allTodos().filter((todo) => todo.status === 'done')
  );
}
