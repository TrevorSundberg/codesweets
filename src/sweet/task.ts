import {EventEmitter} from "events";
import {TaskMeta} from "./task-meta";

process.env.MEMFS_DONT_WARN = true as unknown as string;
import {Volume} from "memfs";

export type TaskData = Record<string, any>

export interface TaskSaved {
  typename: string;
  data?: TaskData;
  components?: TaskSaved[];
}

export class Task extends EventEmitter {
  public static meta = new TaskMeta({
    construct: Task,
    outputs: [Task]
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

    this.log(`${this.constructor.name} constructed`);

    // Perform all validation first before we do any side effects on other tasks.
    const errors = this.meta.validate(data);
    if (errors) {
      throw new Error(errors);
    }

    if (owner) {
      owner.add(this);
    }
  }

  public get meta (): TaskMeta {
    const {meta} = this.constructor as any;
    if (this.constructor !== meta.construct) {
      throw new Error("Invalid TaskMeta, be sure to use: " +
        `static meta : TaskMeta = new TaskMeta(${this.constructor.name}, ...)`);
    }
    return meta;
  }

  /**
   * Serialize the task and it's child components.
   * Only call this once constructed (not during or after initialization).
   */
  public serialize (): TaskSaved {
    if (this.phase !== "constructed") {
      throw Error(`Only serialize a task when constructed (task was '${this.phase}')`);
    }
    const result: TaskSaved = {
      typename: this.constructor.name
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

  private ensure (type: Function): void {
    if (!this.meta.outputs.find((func) => Task.isA(type, func))) {
      throw new Error(`${type.name} is not an output of ${this.constructor.name}`);
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

  private add<T extends Task = Task> (value: T) {
    const {constructor} = value;
    this.ensure(constructor);

    /*
     * Singleton enforcement...
     *if (this.has(constructor)) {
     *  throw new Error(`${constructor.name} already exists within task ${this.constructor.name}`);
     *}
     */

    this.components.push(value);
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
      this.log(`Begin ${component.constructor.name} ${func}`);
      await visitor(component);
      await component.walk(func, visitor);
      this.log(`End ${component.constructor.name} ${func}`);
    }
  }

  private async initialize () {
    await this.walk("initialize", async (component) => {
      const {name} = component.constructor;
      const {inputs} = component.meta;

      for (const input of inputs) {
        const dependency = component.findAbove(input);
        if (!dependency) {
          throw new Error(`Missing dependency ${input.name} in task ${name}`);
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