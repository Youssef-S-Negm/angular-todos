export default interface Todo {
  title: string;
  status: 'pending' | 'done';
  priority: 1 | 2;
  dateCreated: Date;
  id?: string;
}
