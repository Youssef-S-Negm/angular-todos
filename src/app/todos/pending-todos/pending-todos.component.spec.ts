import { signal } from '@angular/core';
import TodosService from '../todos.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Todo from '../../models/todo.model';
import { PendingTodosComponent } from './pending-todos.component';

describe('CompletedTodos', () => {
  let component: PendingTodosComponent;
  let fixture: ComponentFixture<PendingTodosComponent>;
  let todosServiceMock: jasmine.SpyObj<TodosService>;

  const mockAllTodos: Todo[] = [
    {
      dateCreated: new Date(),
      priority: 1,
      status: 'done',
      title: 'mock-title',
      id: 'mock-id-1',
      userId: 'mock-user-id',
    },
    {
      dateCreated: new Date(new Date().getTime() + 1000),
      priority: 1,
      status: 'pending',
      title: 'mock-title-1',
      id: 'mock-id-2',
      userId: 'mock-user-id',
    },
    {
      dateCreated: new Date(new Date().getTime() + 2000),
      priority: 2,
      status: 'pending',
      title: 'mock-title-2',
      id: 'mock-id-3',
      userId: 'mock-user-id',
    },
  ];

  beforeEach(async () => {
    todosServiceMock = jasmine.createSpyObj('TodosService', [''], {
      allTodos: signal(mockAllTodos),
    });

    await TestBed.configureTestingModule({
      imports: [PendingTodosComponent],
      providers: [{ provide: TodosService, useValue: todosServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingTodosComponent);
    component = fixture.componentInstance;
  });

  it('should create pending todos component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter the pending todos', () => {
    expect(component.todos().length).toBe(2);
    expect(component.todos()[0].status).toBe('pending');
    expect(component.todos()[1].status).toBe('pending');
  });

  it("should filter pending todos and todos with title matching 'title-1'", () => {
    component.searchQuery.set('title-1');

    expect(component.todos().length).toBe(1);
    expect(component.todos()[0].status).toBe('pending');
  });

  it('should filter pending todos and sort on date in ascending order', () => {
    component.selectedSortOption.set('date-asc');

    expect(component.todos().length).toBe(2);
    expect(component.todos()[0].id).toBe(mockAllTodos[1].id);
    expect(component.todos()[1].id).toBe(mockAllTodos[2].id);
  });

  it('should filter pending todos and sort on date in descending order', () => {
    component.selectedSortOption.set('date-desc');

    expect(component.todos().length).toBe(2);
    expect(component.todos()[0].id).toBe(mockAllTodos[2].id);
    expect(component.todos()[1].id).toBe(mockAllTodos[1].id);
  });

  it('should filter pending todos and sort on priority in ascending order', () => {
    component.selectedSortOption.set('priority-asc');

    expect(component.todos().length).toBe(2);
    expect(component.todos()[0].id).toBe(mockAllTodos[1].id);
    expect(component.todos()[1].id).toBe(mockAllTodos[2].id);
  });

  it('should filter pending todos and sort on priority in descending order', () => {
    component.selectedSortOption.set('priority-desc');

    expect(component.todos().length).toBe(2);
    expect(component.todos()[0].id).toBe(mockAllTodos[2].id);
    expect(component.todos()[1].id).toBe(mockAllTodos[1].id);
  });

  it('should update searchQuery on calling onSubmitQuery', () => {
    const mockQuery = 'mock-query';

    component.onChangeSearchQuery(mockQuery);

    expect(component.searchQuery()).toBe(mockQuery);
  });
});
