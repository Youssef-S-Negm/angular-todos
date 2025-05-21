import { Component, computed, inject } from '@angular/core';
import { TodoComponent } from '../todo/todo.component';
import TodosService from '../../todos.service';

@Component({
  selector: 'app-completed-todos',
  imports: [TodoComponent],
  templateUrl: './completed-todos.component.html',
  styleUrl: './completed-todos.component.css',
})
export class CompletedTodosComponent {
  private todoService = inject(TodosService);
  todos = computed(() =>
    this.todoService.allTodos().filter((todo) => todo.status === 'done')
  );
}
