export default interface Todo {
  title: string;
  status: Status;
  priority: 1 | 2;
  dateCreated: Date;
  id?: string;
}

export type Status = 'pending' | 'done';
