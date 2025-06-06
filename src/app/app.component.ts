import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { TodosComponent } from './todos/todos.component';
import TodoService from './firebase/todo.service';
import { SpinnerComponent } from "./spinner/spinner.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, TodosComponent, SpinnerComponent],
})
export class AppComponent {
  private todoService = inject(TodoService);
  isLoading = this.todoService.isLoading;
}
