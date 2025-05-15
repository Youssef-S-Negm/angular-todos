import { inject, Injectable, signal } from '@angular/core';
import Todo, { Priority, Status } from '../models/todo.model';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class TodoService {
  private firestore = inject(Firestore);
  private todosCollection = collection(this.firestore, 'todos');
  private todos = signal<Todo[]>([]);
  private isFetching = signal(false);
  allTodos = this.todos.asReadonly();
  isLoading = this.isFetching.asReadonly();

  addTodo$(todo: Todo) {
    this.isFetching.set(true);
    const prevTodos = this.todos();

    return from(addDoc(this.todosCollection, todo)).pipe(
      tap({
        next: (val) => {
          this.todos.set([...prevTodos, { ...todo, id: val.id }]);
        },
        complete: () => this.isFetching.set(false),
      })
    );
  }

  getTodos$() {
    this.isFetching.set(true);

    return from(getDocs(this.todosCollection)).pipe(
      tap({
        next: (snapshot) => {
          const mapped = snapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
              } as Todo)
          );

          this.todos.set(mapped);
        },
        complete: () => this.isFetching.set(false),
      })
    );
  }

  updateTodoStatus$(todo: Todo, status: Status) {
    this.isFetching.set(true);
    const prevTodos = this.todos();

    return from(
      updateDoc(doc(this.firestore, 'todos', todo.id!), { status })
    ).pipe(
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
    const prevTodos = this.todos();

    return from(
      updateDoc(doc(this.firestore, 'todos', todo.id!), { priority })
    ).pipe(
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
