import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import TodoService from '../../firebase/todo.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-add-todos',
  imports: [FormsModule],
  templateUrl: './add-todos.component.html',
})
export class AddTodosComponent {
  private todoService = inject(TodoService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  title = signal('');

  onSubmit() {
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
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
