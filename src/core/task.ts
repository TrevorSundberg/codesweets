import {EventEmitter} from "events";
import TaskMeta from "./task-meta";

process.env.MEMFS_DONT_WARN = true as unknown as string;
import {Volume} from "memfs";

export default class Task extends EventEmitter {
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
  public readonly rawData: any;
  public get fs (): InstanceType<typeof Volume> {
    return this.root.fs;
  }
  public constructor (owner: Task, data: any = {}) {
    super();

    // Perform all validation first before we do any side effects on other tasks.
    const errors = this.meta.validate(data);
    if (errors) {
      throw new Error(errors);
    }

    this.rawData = data;
    this.owner = owner;
    this.ownerIndex = owner ? owner.components.length : -1;

    if (owner) {
      this.root = owner.root;
      owner.add(this);
    } else {
      this.root = this;
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
  public sibling<T extends Task = Task> (base: Function) {
    return this.owner ? this.owner.has<T>(base, this.ownerIndex) : null;
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
  protected async initialize () {
    for (const component of this.components) {
      const {name} = component.constructor;
      const {inputs} = component.meta;

      for (const input of inputs) {
        const dependency = component.sibling(input);
        if (!dependency) {
          throw new Error(`Missing dependency ${input.name} in task ${name}`);
        }
        component.dependencies.push(dependency);
        dependency.dependents.push(this);
      }

      await component.onInitialize(...component.dependencies);
      await component.initialize();
    }
  }
}
