import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import TodosService from '../todos.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-add-todos',
  imports: [FormsModule],
  templateUrl: './add-todos.component.html',
})
export class AddTodosComponent {
  private todoService = inject(TodosService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  title = signal('');

  onSubmit() {
    if (this.title().length > 0) {
      const subscription = this.todoService
        .addTodo$({
          dateCreated: new Date(),
          priority: 1,
          status: 'pending',
          title: this.title(),
          userId: this.authService.userId ? this.authService.userId : undefined,
        })
        .subscribe({
          next: () => this.title.set(''),
          error: (error) =>
            alert('Something went wrong. Please try again later.'),
        });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    } else {
      alert('Please enter a todo title');
    }
  }
}
