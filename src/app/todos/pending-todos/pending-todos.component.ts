import { Component, computed, inject, signal } from '@angular/core';
import { SearchPendingTodosComponent } from '../search-pending-todos/search-pending-todos.component';
import TaskService from '../../firebase/todo.service';
import { TodoComponent } from '../todo/todo.component';
import { FormsModule } from '@angular/forms';

type SortOptionValue =
  | 'date-asc'
  | 'date-desc'
  | 'priority-asc'
  | 'priority-desc';

@Component({
  selector: 'app-pending-todos',
  imports: [SearchPendingTodosComponent, TodoComponent, FormsModule],
  templateUrl: './pending-todos.component.html',
  styleUrl: './pending-todos.component.css',
})
export class PendingTodosComponent {
  private taskService = inject(TaskService);
  selectedSortOption = signal<SortOptionValue>('date-asc');
  searchQuery = signal('');
  todos = computed(() =>
    this.taskService
      .allTodos()
      .filter((todo) => {
        if (this.searchQuery().length > 0) {
          return (
            todo.status === 'pending' &&
            todo.title
              .toLocaleLowerCase()
              .includes(this.searchQuery().trim().toLocaleLowerCase())
          );
        }

        return todo.status === 'pending';
      })
      .sort((a, b) => {
        switch (this.selectedSortOption()) {
          case 'date-asc':
            return a.dateCreated > b.dateCreated ? 1 : -1;
          case 'date-desc':
            return a.dateCreated > b.dateCreated ? -1 : 1;
          case 'priority-asc':
            return a.priority > b.priority ? 1 : -1;
          case 'priority-desc':
            return a.priority > b.priority ? -1 : 1;
        }
      })
  );

  onChangeSearchQuery(input: string) {
    this.searchQuery.set(input);
  }
}
