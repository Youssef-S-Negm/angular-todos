export default interface Todo {
  title: string;
  status: Status;
  priority: Priority;
  dateCreated: Date;
  id?: string;
}

export type Status = 'pending' | 'done';
export type Priority = 1 | 2;
