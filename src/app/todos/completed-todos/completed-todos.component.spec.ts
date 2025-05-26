import { signal } from '@angular/core';
import TodosService from '../todos.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedTodosComponent } from './completed-todos.component';
import Todo from '../../models/todo.model';

describe('CompletedTodos', () => {
  let component: CompletedTodosComponent;
  let fixture: ComponentFixture<CompletedTodosComponent>;
  let todosServiceMock: jasmine.SpyObj<TodosService>;

  const mockAllTodos: Todo[] = [
    {
      dateCreated: new Date(),
      priority: 1,
      status: 'pending',
      title: 'mock-title',
      id: 'mock-id-1',
      userId: 'mock-user-id',
    },
    {
      dateCreated: new Date(),
      priority: 1,
      status: 'done',
      title: 'mock-title',
      id: 'mock-id-2',
      userId: 'mock-user-id',
    },
    {
      dateCreated: new Date(),
      priority: 1,
      status: 'done',
      title: 'mock-title',
      id: 'mock-id-3',
      userId: 'mock-user-id',
    },
  ];

  beforeEach(async () => {
    todosServiceMock = jasmine.createSpyObj('TodosService', [''], {
      allTodos: signal(mockAllTodos),
    });

    await TestBed.configureTestingModule({
      imports: [CompletedTodosComponent],
      providers: [{ provide: TodosService, useValue: todosServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedTodosComponent);
    component = fixture.componentInstance;
  });

  it('should create completed todos component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter the completed todos', () => {
    expect(component.todos().length).toBe(2);
    expect(component.todos()[0].status).toBe('done');
    expect(component.todos()[1].status).toBe('done');
  });
});
