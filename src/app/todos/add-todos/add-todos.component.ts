import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import TodosService from '../todos.service';

@Component({
  selector: 'app-add-todos',
  imports: [FormsModule],
  templateUrl: './add-todos.component.html',
})
export class AddTodosComponent {
  private todoService = inject(TodosService);
  private destroyRef = inject(DestroyRef);
  title = signal('');

  onSubmit() {
    const subscription = this.todoService
      .addTodo$({
        dateCreated: new Date(),
        priority: 1,
        status: 'pending',
        title: this.title(),
      })
      .subscribe({
        next: () => this.title.set(''),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
