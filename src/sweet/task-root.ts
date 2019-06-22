import {Task} from "./task";
import {TaskMeta} from "./task-meta";
import {Volume} from "memfs";

export class TaskRoot extends Task {
  public static meta: TaskMeta = new TaskMeta({
    construct: TaskRoot,
    outputs: [Task],
    typename: "TaskRoot"
  })

  private volume = new Volume();

  private logger: (...args: any[]) => any;

  public get fs () {
    return this.volume;
  }

  public get log () {
    // eslint-disable-next-line no-empty-function
    return this.logger || (() => {});
  }

  public set log (callback: (...args: any[]) => any) {
    this.logger = callback;
  }

  public constructor () {
    super(null);
  }

  public run () {
    return super.run();
  }
}
