import { Component, computed, inject } from '@angular/core';
import { SearchPendingTodosComponent } from '../search-pending-todos/search-pending-todos.component';
import TaskService from '../../firebase/todo.service';
import { TodoComponent } from '../todo/todo.component';

@Component({
  selector: 'app-pending-todos',
  imports: [SearchPendingTodosComponent, TodoComponent],
  templateUrl: './pending-todos.component.html',
  styleUrl: './pending-todos.component.css',
})
export class PendingTodosComponent {
  private taskService = inject(TaskService);
  todos = computed(() =>
    this.taskService.allTodos().filter((todo) => todo.status === 'pending')
  );
}
