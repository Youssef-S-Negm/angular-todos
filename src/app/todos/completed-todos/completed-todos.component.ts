import { Component } from '@angular/core';
import { TodoComponent } from "../todo/todo.component";

@Component({
  selector: 'app-completed-todos',
  imports: [TodoComponent],
  templateUrl: './completed-todos.component.html',
  styleUrl: './completed-todos.component.css'
})
export class CompletedTodosComponent {

}
