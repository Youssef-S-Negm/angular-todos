import { inject, Injectable, signal } from '@angular/core';
import Todo, { Priority, Status } from '../models/todo.model';
import { catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  TODOS_URL,
  FIRESTORE_URL_QUERY_ENABLED,
} from '../firebase/firebase.config';
import { AuthService } from '../auth/auth.service';

interface TodoFirestoreDocument {
  name?: string;
  createTime?: string;
  updateTime?: string;
  fields: {
    title: { stringValue: string };
    status: { stringValue: string };
    priority: { integerValue: number };
    dateCreated: { timestampValue: string };
    userId?: { stringValue: string };
  };
}

interface GetTodosResponse {
  document: TodoFirestoreDocument;
}

@Injectable()
export default class TodosService {
  private todos = signal<Todo[]>([]);
  private isFetching = signal(false);
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  allTodos = this.todos.asReadonly();
  isLoading = this.isFetching.asReadonly();

  private convertTodoFirestoreDocumentToTodo(
    document: TodoFirestoreDocument
  ): Todo {
    const parts = document.name?.split('/');

    if (parts) {
      const id = parts[parts.length - 1];

      return {
        dateCreated: new Date(document.fields.dateCreated.timestampValue),
        priority: document.fields.priority.integerValue as Priority,
        status: document.fields.status.stringValue as Status,
        title: document.fields.title.stringValue,
        id,
        userId: document.fields.userId?.stringValue,
      };
    }

    return {
      dateCreated: new Date(document.fields.dateCreated.timestampValue),
      priority: document.fields.priority.integerValue as Priority,
      status: document.fields.status.stringValue as Status,
      title: document.fields.title.stringValue,
      userId: document.fields.userId?.stringValue,
    };
  }

  private convertTodoToTodoFirestoreDocument(
    todo: Todo
  ): TodoFirestoreDocument {
    return {
      fields: {
        dateCreated: { timestampValue: todo.dateCreated.toISOString() },
        priority: { integerValue: todo.priority },
        status: { stringValue: todo.status },
        title: { stringValue: todo.title },
        userId: todo.userId
          ? {
              stringValue: todo.userId,
            }
          : undefined,
      },
    };
  }

  addTodo$(todo: Todo) {
    this.isFetching.set(true);

    return this.httpClient
      .post<TodoFirestoreDocument>(
        TODOS_URL,
        this.convertTodoToTodoFirestoreDocument(todo)
      )
      .pipe(
        map((res) => this.convertTodoFirestoreDocumentToTodo(res)),
        tap({
          next: (val) => this.todos.update((prev) => [...prev, val]),
          complete: () => this.isFetching.set(false),
        }),
        catchError((error) => {
          this.isFetching.set(false);
          return throwError(() => error);
        })
      );
  }

  getTodos$() {
    this.isFetching.set(true);

    const body = {
      structuredQuery: {
        from: [{ collectionId: 'todos' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'userId' },
            op: 'EQUAL',
            value: { stringValue: this.authService.userId },
          },
        },
      },
    };

    return this.httpClient
      .post<GetTodosResponse[]>(FIRESTORE_URL_QUERY_ENABLED, body)
      .pipe(
        map((val) => {
          if (val[0].document) {
            return val.map((doc) =>
              this.convertTodoFirestoreDocumentToTodo(doc.document)
            );
          }

          return [];
        }),
        tap({
          next: (val) => this.todos.set(val),
          complete: () => this.isFetching.set(false),
        }),
        catchError((error) => {
          this.isFetching.set(false);
          return throwError(() => error);
        })
      );
  }

  updateTodoStatus$(todo: Todo, status: Status) {
    this.isFetching.set(true);
    const payload = this.convertTodoToTodoFirestoreDocument(todo);
    payload.fields.status.stringValue = status;
    const prevTodos = this.todos();

    return this.httpClient
      .patch<TodoFirestoreDocument>(`${TODOS_URL}/${todo.id}`, payload)
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
        }),
        catchError((error) => {
          this.isFetching.set(false);
          return throwError(() => error);
        })
      );
  }

  updateTodoPriority$(todo: Todo, priority: Priority) {
    this.isFetching.set(true);
    const payload = this.convertTodoToTodoFirestoreDocument(todo);
    payload.fields.priority.integerValue = priority;
    const prevTodos = this.todos();

    return this.httpClient
      .patch<TodoFirestoreDocument>(`${TODOS_URL}/${todo.id}`, payload)
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
        }),
        catchError((error) => {
          this.isFetching.set(false);
          return throwError(() => error);
        })
      );
  }
}
