import {EventEmitter} from "events";
import {TaskMeta} from "./task-meta";
import {Volume} from "memfs";

export type TaskData = Record<string, any>

export interface TaskSaved {
  typename: string;
  data?: TaskData;
  components?: TaskSaved[];
}

export class Task extends EventEmitter {
  public static meta: TaskMeta = new TaskMeta({
    construct: Task,
    hidden: true,
    outputs: [Task],
    typename: "Task"
  })

  public readonly root: Task;

  public readonly owner: Task;

  public readonly ownerIndex: number;

  public readonly dependencies: Task[] = [];

  public readonly dependents: Task[] = [];

  public readonly components: Task[] = [];

  public readonly rawData: TaskData;

  private phase: "constructed" | "initialized" = "constructed";

  public get fs (): InstanceType<typeof Volume> {
    return this.root.fs;
  }

  public get log (): (...args: any[]) => any {
    return this.root.log;
  }

  public constructor (owner: Task, data: TaskData = {}) {
    super();

    this.root = owner ? owner.root : this;
    this.rawData = data;
    this.owner = owner;
    this.ownerIndex = owner ? owner.components.length : -1;

    this.log(`${this.meta.typename} constructed`);

    // Perform all validation first before we do any side effects on other tasks.
    const errors = this.meta.validate(data);
    if (errors) {
      throw new Error(errors);
    }

    if (owner) {
      owner.ensure(this.meta);
      owner.components.push(this);
    }
  }

  public get meta (): TaskMeta {
    const {meta} = this.constructor as any;
    if (this.constructor !== meta.construct) {
      throw new Error("Invalid TaskMeta, be sure to use: " +
        "static meta : TaskMeta = new TaskMeta(...)");
    }
    return meta;
  }

  public static deserialize (object: TaskSaved, owner: Task = null): Task {
    console.log(TaskMeta.loadedByName);
    console.log(object);
    const meta = TaskMeta.loadedByName[object.typename || "TaskRoot"];
    // eslint-disable-next-line new-cap
    const task = new meta.construct(owner, object.data);
    if (object.components) {
      object.components.forEach((saved) => Task.deserialize(saved, task));
    }
    return task;
  }

  public serialize (): TaskSaved {
    if (this.phase !== "constructed") {
      throw Error(`Only serialize a task when constructed (task was '${this.phase}')`);
    }
    const result: TaskSaved = {
      typename: this.meta.typename
    };
    if (Object.values(this.rawData).length !== 0) {
      result.data = this.rawData;
    }
    if (this.components.length !== 0) {
      result.components = this.components.map((component) => component.serialize());
    }
    return result;
  }

  public static isA (derived: Function, base: Function): boolean {
    let type = derived;
    while (type) {
      if (type === base) {
        return true;
      }
      type = Object.getPrototypeOf(type);
    }
    return false;
  }

  private ensure (meta: TaskMeta): void {
    if (!this.meta.outputs.find((func) => Task.isA(meta.construct, func))) {
      throw new Error(`${meta.typename} is not an output of ${this.meta.typename}`);
    }
  }

  public has<T extends Task = Task> (base: Function, index?: number): T {
    if (Task.isA(this.constructor, base)) {
      return this as Task as T;
    }

    // Find the first component above this index (dependency order) that is closest to the index.
    const nearest = this.components.slice(0, index).reverse();
    for (const component of nearest) {
      if (Task.isA(component.constructor, base)) {
        return component as T;
      }
      const child = component.has(base);
      if (child) {
        return child as T;
      }
    }
    return null;
  }

  public findAbove<T extends Task = Task> (base: Function): T {
    if (!this.owner) {
      return null;
    }
    const component = this.owner.has<T>(base, this.ownerIndex);
    return component ? component : this.owner.findAbove<T>(base);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function
  protected async onInitialize (...args: any[]) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function
  protected async onAllInitialized (...args: any[]) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function
  protected async onDestroy (...args: any[]) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function
  protected async onAllDestroyed (...args: any[]) {
  }

  private async walk (func: string, visitor: (component: Task) => Promise<any>) {
    for (const component of this.components) {
      this.log(`Begin ${component.meta.typename} ${func}`);
      await visitor(component);
      await component.walk(func, visitor);
      this.log(`End ${component.meta.typename} ${func}`);
    }
  }

  private async initialize () {
    await this.walk("initialize", async (component) => {
      const {inputs, typename} = component.meta;

      for (const input of inputs) {
        const dependency = component.findAbove(input);
        if (!dependency) {
          throw new Error(`Missing dependency ${input.meta.typename} in task ${typename}`);
        }
        component.dependencies.push(dependency);
        dependency.dependents.push(this);
      }

      await component.onInitialize(...component.dependencies);
      component.phase = "initialized";
    });
  }

  private async allInitialized () {
    await this.walk("allInitialized", (component) => component.onAllInitialized());
  }

  private async destroy () {
    await this.walk("destroy", (component) => component.onDestroy());
  }

  private async allDestroyed () {
    await this.walk("allDestroyed", (component) => component.onAllDestroyed());
  }

  protected async run () {
    await this.initialize();
    await this.allInitialized();
    await this.destroy();
    await this.allDestroyed();
  }
}
