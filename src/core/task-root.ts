import Task from "./task";
import TaskMeta from "./task-meta";

export default class TaskRoot extends Task {
  public static meta = new TaskMeta({
    construct: TaskRoot,
    outputs: [Task]
  })
  public constructor () {
    super(null);
  }
  public initialize (...args: any[]) {
    return super.initialize(args);
  }
}
