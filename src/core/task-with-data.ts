import Task from "./task";

export default class TaskWithData<T> extends Task {
  public get data (): T {
    return this.rawData;
  }
  // eslint-disable-next-line no-useless-constructor
  public constructor (owner: Task, data: T) {
    super(owner, data);
  }
}
