import { Component, computed, inject } from '@angular/core';
import { TodoComponent } from '../todo/todo.component';
import TaskService from '../../firebase/todo.service';

@Component({
  selector: 'app-completed-todos',
  imports: [TodoComponent],
  templateUrl: './completed-todos.component.html',
  styleUrl: './completed-todos.component.css',
})
export class CompletedTodosComponent {
  private taskService = inject(TaskService);
  todos = computed(() =>
    this.taskService.allTodos().filter((todo) => todo.status === 'done')
  );
}
