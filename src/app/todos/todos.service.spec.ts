import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import TodosService, {
  GetTodosResponse,
  TodoFirestoreDocument,
} from './todos.service';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/auth.service';
import Todo from '../models/todo.model';
import {
  FIRESTORE_URL_QUERY_ENABLED,
  TODOS_URL,
} from '../firebase/firebase.config';

describe('TodosService', () => {
  let todosService: TodosService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const mockUserId = 'mock-user-id';

  let mockToBeAddedTodo: Todo = {
    dateCreated: new Date(),
    priority: 1,
    status: 'pending',
    title: 'mockTodo',
    userId: 'mock-user-id',
  };
  let mockAddedTodo: Todo = {
    ...mockToBeAddedTodo,
  };
  let mockToBeAddedTodoFireStoreDocument: TodoFirestoreDocument = {
    fields: {
      dateCreated: {
        timestampValue: mockToBeAddedTodo.dateCreated.toISOString(),
      },
      priority: { integerValue: mockToBeAddedTodo.priority },
      status: { stringValue: mockToBeAddedTodo.status },
      title: { stringValue: mockToBeAddedTodo.title },
      userId: { stringValue: mockToBeAddedTodo.userId as string },
    },
  };
  let mockAddedTodoFireStoreDocument: TodoFirestoreDocument = {
    name: 'mock/todo-id',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    fields: { ...mockToBeAddedTodoFireStoreDocument.fields },
  };
  let mockGetTodosResponse: GetTodosResponse[] = [
    {
      document: {
        name: 'mock/todo-1',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        fields: {
          userId: { stringValue: 'mock-user-id' },
          title: { stringValue: 'todo-1' },
          dateCreated: { timestampValue: new Date().toISOString() },
          priority: { integerValue: 1 },
          status: { stringValue: 'pending' },
        },
      },
    },
    {
      document: {
        name: 'mock/todo-2',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        fields: {
          userId: { stringValue: 'mock-user-id' },
          title: { stringValue: 'todo-2' },
          dateCreated: { timestampValue: new Date().toISOString() },
          priority: { integerValue: 1 },
          status: { stringValue: 'done' },
        },
      },
    },
  ];

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      userId: mockUserId,
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TodosService,
        {
          provide: AuthService,
          useValue: authServiceSpy,
        },
      ],
    });
    todosService = TestBed.inject(TodosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(todosService).toBeTruthy();
  });

  it('should add a todo and return the added todo', () => {
    todosService.addTodo$(mockToBeAddedTodo).subscribe((val) => {
      expect(val).toBeTruthy();
      expect(val.dateCreated).toEqual(mockAddedTodo.dateCreated);
    });

    const req = httpMock.expectOne(TODOS_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockToBeAddedTodoFireStoreDocument);

    req.flush(mockAddedTodoFireStoreDocument);
  });

  it('should fail add todo and return a bad request', () => {
    todosService.addTodo$(mockToBeAddedTodo).subscribe({
      next: () => fail('should have failed the test'),
      error: (error) => expect(error.status).toBe(400),
    });

    const req = httpMock.expectOne(TODOS_URL);

    req.flush(null, { status: 400, statusText: 'Bad Request' });
  });

  it('should fetch user todos and return a list of todos', () => {
    const body = {
      structuredQuery: {
        from: [{ collectionId: 'todos' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'userId' },
            op: 'EQUAL',
            value: { stringValue: mockUserId },
          },
        },
      },
    };

    todosService.getTodos$().subscribe((val) => {
      expect(val).toBeTruthy();
      expect(todosService.allTodos().length).toBe(mockGetTodosResponse.length);
      expect(todosService.allTodos()[0].title).toBe(
        mockGetTodosResponse[0].document.fields.title.stringValue
      );
      expect(todosService.allTodos()[1].title).toBe(
        mockGetTodosResponse[1].document.fields.title.stringValue
      );
    });

    const req = httpMock.expectOne(FIRESTORE_URL_QUERY_ENABLED);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(mockGetTodosResponse);
  });

  it('should fail to fetch user todos', () => {
    const body = {
      structuredQuery: {
        from: [{ collectionId: 'todos' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'userId' },
            op: 'EQUAL',
            value: { stringValue: mockUserId },
          },
        },
      },
    };

    todosService.getTodos$().subscribe({
      next: () => fail('should have failed the test'),
      error: (error) => expect(error.status).toBe(400),
    });

    const req = httpMock.expectOne(FIRESTORE_URL_QUERY_ENABLED);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(null, { status: 400, statusText: 'Bad Request' });
  });

  it('should update a todo status and update the corresponding todo in allTodos', () => {
    const mockToBeUpdatedTodo: Todo = {
      dateCreated: new Date(),
      priority: 1,
      status: 'pending',
      title: 'mock-title',
      id: 'mock-id',
      userId: 'mock-user-id',
    };
    const body: TodoFirestoreDocument = {
      fields: {
        dateCreated: {
          timestampValue: mockToBeUpdatedTodo.dateCreated.toISOString(),
        },
        priority: { integerValue: mockToBeUpdatedTodo.priority },
        status: { stringValue: 'done' },
        title: { stringValue: mockToBeUpdatedTodo.title },
        userId: { stringValue: mockToBeUpdatedTodo.userId as string },
      },
    };

    (todosService as any).todos.set([mockToBeUpdatedTodo]); // initial val to the todos signal array

    todosService
      .updateTodoStatus$(mockToBeUpdatedTodo, 'done')
      .subscribe(() => {
        expect(todosService.allTodos()[0].status).toBe('done');
      });

    const req = httpMock.expectOne(`${TODOS_URL}/${mockToBeUpdatedTodo.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);

    req.flush({ fields: { ...body.fields, status: { stringValue: 'done' } } });
  });

  it('should fail to update a todo status', () => {
    const mockToBeUpdatedTodo: Todo = {
      dateCreated: new Date(),
      priority: 1,
      status: 'pending',
      title: 'mock-title',
      id: 'mock-id',
      userId: 'mock-user-id',
    };
    const body: TodoFirestoreDocument = {
      fields: {
        dateCreated: {
          timestampValue: mockToBeUpdatedTodo.dateCreated.toISOString(),
        },
        priority: { integerValue: mockToBeUpdatedTodo.priority },
        status: { stringValue: 'done' },
        title: { stringValue: mockToBeUpdatedTodo.title },
        userId: { stringValue: mockToBeUpdatedTodo.userId as string },
      },
    };

    (todosService as any).todos.set([mockToBeUpdatedTodo]); // initial val to the todos signal array

    todosService.updateTodoStatus$(mockToBeUpdatedTodo, 'done').subscribe({
      next: () => fail('should have failed the test'),
      error: (error) => expect(error.status).toBe(400),
    });

    const req = httpMock.expectOne(`${TODOS_URL}/${mockToBeUpdatedTodo.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);

    req.flush(null, { status: 400, statusText: 'Bad Reqyest' });
  });

  it('should update a todo priority and update the corresponding todo in allTodos', () => {
    const mockToBeUpdatedTodo: Todo = {
      dateCreated: new Date(),
      priority: 1,
      status: 'pending',
      title: 'mock-title',
      id: 'mock-id',
      userId: 'mock-user-id',
    };
    const body: TodoFirestoreDocument = {
      fields: {
        dateCreated: {
          timestampValue: mockToBeUpdatedTodo.dateCreated.toISOString(),
        },
        priority: { integerValue: 2 },
        status: { stringValue: mockToBeUpdatedTodo.status },
        title: { stringValue: mockToBeUpdatedTodo.title },
        userId: { stringValue: mockToBeUpdatedTodo.userId as string },
      },
    };

    (todosService as any).todos.set([mockToBeUpdatedTodo]); // initial val to the todos signal array

    todosService.updateTodoPriority$(mockToBeUpdatedTodo, 2).subscribe(() => {
      expect(todosService.allTodos()[0].priority).toBe(2);
    });

    const req = httpMock.expectOne(`${TODOS_URL}/${mockToBeUpdatedTodo.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);

    req.flush({ fields: { ...body.fields, status: { stringValue: 'done' } } });
  });
  it('should update a todo priority and update the corresponding todo in allTodos', () => {
    const mockToBeUpdatedTodo: Todo = {
      dateCreated: new Date(),
      priority: 1,
      status: 'pending',
      title: 'mock-title',
      id: 'mock-id',
      userId: 'mock-user-id',
    };
    const body: TodoFirestoreDocument = {
      fields: {
        dateCreated: {
          timestampValue: mockToBeUpdatedTodo.dateCreated.toISOString(),
        },
        priority: { integerValue: 2 },
        status: { stringValue: mockToBeUpdatedTodo.status },
        title: { stringValue: mockToBeUpdatedTodo.title },
        userId: { stringValue: mockToBeUpdatedTodo.userId as string },
      },
    };

    (todosService as any).todos.set([mockToBeUpdatedTodo]); // initial val to the todos signal array

    todosService.updateTodoPriority$(mockToBeUpdatedTodo, 2).subscribe(() => {
      expect(todosService.allTodos()[0].priority).toBe(2);
    });

    const req = httpMock.expectOne(`${TODOS_URL}/${mockToBeUpdatedTodo.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);

    req.flush({ fields: { ...body.fields, status: { stringValue: 'done' } } });
  });

  it('should fail to update todo priority', () => {
    const mockToBeUpdatedTodo: Todo = {
      dateCreated: new Date(),
      priority: 1,
      status: 'pending',
      title: 'mock-title',
      id: 'mock-id',
      userId: 'mock-user-id',
    };
    const body: TodoFirestoreDocument = {
      fields: {
        dateCreated: {
          timestampValue: mockToBeUpdatedTodo.dateCreated.toISOString(),
        },
        priority: { integerValue: 2 },
        status: { stringValue: mockToBeUpdatedTodo.status },
        title: { stringValue: mockToBeUpdatedTodo.title },
        userId: { stringValue: mockToBeUpdatedTodo.userId as string },
      },
    };

    (todosService as any).todos.set([mockToBeUpdatedTodo]); // initial val to the todos signal array

    todosService.updateTodoPriority$(mockToBeUpdatedTodo, 2).subscribe({
      next: () => fail('Should have failed the test'),
      error: (error) => expect(error.status).toBe(400),
    });

    const req = httpMock.expectOne(`${TODOS_URL}/${mockToBeUpdatedTodo.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);

    req.flush(null, { status: 400, statusText: 'Bad Request' });
  });
});
