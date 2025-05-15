import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-pending-todos',
  imports: [FormsModule],
  templateUrl: './search-pending-todos.component.html',
  styleUrl: './search-pending-todos.component.css',
})
export class SearchPendingTodosComponent {
  query = signal('');
  onSubmitQuery = output<string>();

  onSubmit() {
    this.onSubmitQuery.emit(this.query());
  }
}
