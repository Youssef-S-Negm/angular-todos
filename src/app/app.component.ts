import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { TodosComponent } from "./todos/todos.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, TodosComponent],
})
export class AppComponent {}
