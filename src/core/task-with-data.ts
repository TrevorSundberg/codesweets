import Task from './task'

export default class TaskWithData<T> extends Task {
  public get data(): T { return this.rawData; }

  public constructor(owner: Task, data: T) {
    super(owner, data)
  }
}