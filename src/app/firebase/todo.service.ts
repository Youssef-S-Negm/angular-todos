import { inject, Injectable, signal } from '@angular/core';
import Todo, { Priority, Status } from '../models/todo.model';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class TodoService {
  private firestore = inject(Firestore);
  private todosCollection = collection(this.firestore, 'todos');
  private todos = signal<Todo[]>([]);
  allTodos = this.todos.asReadonly();

  addTodo$(todo: Todo) {
    return from(addDoc(this.todosCollection, todo));
  }

  getTodos$() {
    return (
      collectionData(this.todosCollection, { idField: 'id' }) as Observable<
        Todo[]
      >
    ).pipe(
      tap({
        next: (val) => this.todos.set(val),
      })
    );
  }

  updateTodoStatus$(todo: Todo, status: Status) {
    return from(updateDoc(doc(this.firestore, 'todos', todo.id!), { status }));
  }

  updateTodoPriority$(todo: Todo, priority: Priority) {
    return from(
      updateDoc(doc(this.firestore, 'todos', todo.id!), { priority })
    );
  }
}
