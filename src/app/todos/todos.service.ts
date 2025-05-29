import { inject, Injectable, signal } from '@angular/core';
import Todo, { Priority, Status } from '../models/todo.model';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../enviroments/enviroments';

interface TodoFirestoreDocument {
  name?: string;
  createTime?: string;
  updateTime?: string;
  fields: {
    title: { stringValue: string };
    status: { stringValue: string };
    priority: { integerValue: number };
    dateCreated: { timestampValue: string };
  };
}

interface GetTodosResponse {
  documents: TodoFirestoreDocument[];
}

@Injectable({
  providedIn: 'root',
})
export default class TodosService {
  private todos = signal<Todo[]>([]);
  private isFetching = signal(false);
  private httpClient = inject(HttpClient);
  allTodos = this.todos.asReadonly();
  isLoading = this.isFetching.asReadonly();


  addTodo$(todo: Todo) {
    this.isFetching.set(true);

    return this.httpClient.post<Todo>(URL, todo).pipe(
      tap({
        next: (val) => this.todos.update((prev) => [...prev, val]),
        complete: () => this.isFetching.set(false),
      })
    );
  }

  getTodos$() {
    this.isFetching.set(true);

    return this.httpClient.get<Todo[]>(URL).pipe(
      tap({
        next: (val) => this.todos.set(val),
        complete: () => this.isFetching.set(false),
      })
    );
  }

  updateTodoStatus$(todo: Todo, status: Status) {
    this.isFetching.set(true);
    todo.status = status;
    const prevTodos = this.todos();

    return this.httpClient
      .put<Todo>(`${URL}/${todo.id}`, todo)
      .pipe(
        tap({
          next: () => {
            for (let i = 0; i < prevTodos.length; i++) {
              if (prevTodos[i].id === todo.id) {
                prevTodos[i] = { ...prevTodos[i], status };
                break;
              }
            }

            this.todos.set([...prevTodos]);
          },
          complete: () => this.isFetching.set(false),
        })
      );
  }

  updateTodoPriority$(todo: Todo, priority: Priority) {
    this.isFetching.set(true);
    todo.priority = priority
    const prevTodos = this.todos();

    return this.httpClient
      .put<TodoFirestoreDocument>(`${URL}/${todo.id}`, todo)
      .pipe(
        tap({
          next: () => {
            for (let i = 0; i < prevTodos.length; i++) {
              if (prevTodos[i].id === todo.id) {
                prevTodos[i] = { ...prevTodos[i], priority };
                break;
              }
            }

            this.todos.set([...prevTodos]);
          },
          complete: () => this.isFetching.set(false),
        })
      );
  }
}
