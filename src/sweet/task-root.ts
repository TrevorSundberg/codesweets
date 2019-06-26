import {Task, TaskLog} from "./task";
import {TaskMeta} from "./task-meta";
import {Volume} from "memfs";

export class TaskRoot extends Task {
  public static meta: TaskMeta = new TaskMeta({
    construct: TaskRoot,
    hidden: true,
    outputs: [Task],
    typename: "TaskRoot"
  })

  private volume = new Volume();

  private logger: TaskLog;

  public get fs () {
    return this.volume;
  }

  public get log () {
    return this.logger || console.log;
  }

  public set log (callback: TaskLog) {
    this.logger = callback;
  }

  public constructor () {
    super(null);
  }

  public run () {
    return super.run();
  }
}
