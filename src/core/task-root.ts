import Task from "./task";
import TaskMeta from "./task-meta";

process.env.MEMFS_DONT_WARN = true as unknown as string;
import {Volume} from "memfs";

export default class TaskRoot extends Task {
  public static meta = new TaskMeta({
    construct: TaskRoot,
    outputs: [Task]
  })

  private volume = new Volume()

  public get fs () {
    return this.volume;
  }

  public constructor () {
    super(null);
  }

  public initialize () {
    return super.initialize();
  }
}
