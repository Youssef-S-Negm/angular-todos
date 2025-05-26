import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import TodosService, { TodoFirestoreDocument } from '../todos.service';
import Todo from '../../models/todo.model';
import { ComponentRef } from '@angular/core';
import { of } from 'rxjs';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let componentRef: ComponentRef<TodoComponent>;
  let fixture: ComponentFixture<TodoComponent>;
  let todosServiceMock: jasmine.SpyObj<TodosService>;

  const mockTodo: Todo = {
    dateCreated: new Date(),
    priority: 1,
    status: 'pending',
    title: 'mock-title',
    id: 'mock-id',
    userId: 'mock-user-id',
  };

  const mockUpdateTodoResponse: TodoFirestoreDocument = {
    fields: {
      dateCreated: { timestampValue: new Date().toISOString() },
      priority: { integerValue: 1 },
      status: { stringValue: 'pending' },
      title: { stringValue: 'mock-title' },
      userId: { stringValue: 'mock-user-id' },
    },
  };

  beforeEach(async () => {
    todosServiceMock = jasmine.createSpyObj('TodosService', [
      'updateTodoStatus$',
      'updateTodoPriority$',
    ]);

    await TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [{ provide: TodosService, useValue: todosServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create todo component', () => {
    expect(component).toBeTruthy();
  });

  it('should call TodoService.updateTodoStatus$() on invoking onChangeStatus()', () => {
    componentRef.setInput('todo', mockTodo);

    todosServiceMock.updateTodoStatus$.and.returnValue(
      of(mockUpdateTodoResponse)
    );

    component.onChangeStatus();

    expect(todosServiceMock.updateTodoStatus$).toHaveBeenCalledWith(
      mockTodo,
      'done'
    );
  });

  it('should call TodoService.updateTodoPriority$() on invoking onChangePriority()', () => {
    componentRef.setInput('todo', mockTodo);

    todosServiceMock.updateTodoPriority$.and.returnValue(
      of(mockUpdateTodoResponse)
    );

    component.onChangePriority();

    expect(todosServiceMock.updateTodoPriority$).toHaveBeenCalledWith(
      mockTodo,
      2
    );
  });
});
