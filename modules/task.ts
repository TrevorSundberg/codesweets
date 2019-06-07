import TaskMeta from './task-meta'
import { EventEmitter } from 'events';

export default class Task extends EventEmitter {
    public static meta: TaskMeta = new TaskMeta({
        construct: Task,
        outputs: [Task],
    })

    public readonly owner: Task;
    public readonly ownerIndex: number = 0;
    public readonly dependencies: Task[] = [];
    public readonly dependents: Task[] = [];
    public readonly components: Task[] = [];
    public readonly rawData: any;

    public constructor(owner: Task, data: any = {}) {
        super()
        const errors = this.meta.validate(data)
        if (errors) {
            throw new Error(errors)
        }
        this.rawData = data;
        this.owner = owner;
        if (owner) {
            this.ownerIndex = owner.components.length;
            owner.add(this);
        }

        const ourName = this.constructor.name;
        const inputs = this.meta.inputs;

        for (let i = 0; i < inputs.length; ++i) {
            const input = inputs[i]
            const dependency = this.sibling(input)

            if (!dependency) {
                throw new Error(`Missing dependency ${input.name} in task ${ourName}`)
            }

            this.dependencies.push(dependency)
            dependency.dependents.push(this)
        }
    }

    public get meta(): TaskMeta {
        const meta = (this.constructor as any).meta;
        if (this.constructor !== meta.construct) {
            throw new Error(`Invalid TaskMeta, be sure to use: static meta : TaskMeta = new TaskMeta(${this.constructor.name}, ...)`)
        }
        return meta;
    }

    public static isA(type: Function, base: Function): boolean {
        while (type) {
            if (type === base) {
                return true;
            }
            type = Object.getPrototypeOf(type)
        }
        return false;
    }

    private ensure(type: Function): void {
        if (!this.meta.outputs.find(func => Task.isA(type, func))) {
            throw new Error(`${type.name} is not an output of ${this.constructor.name}`);
        }
    }

    public has<T extends Task>(base: Function, index: number = 0): T {
        this.ensure(base);
        if (Task.isA(this.constructor, base)) {
            return this as Task as T;
        }

        const predicate = (component: Task) => Task.isA(component.constructor, base)

        // Find the first component above this index (dependency order) that is closest to the index.
        const foundTaskAbove = this.components.slice(0, index).reverse().find(predicate) as T
        return foundTaskAbove;
    // If that fails, find the task below (nearest first).
    //return foundTaskAbove ? foundTaskAbove : this.components.slice(index).find(predicate) as T
    }

    public sibling<T extends Task>(base: Function) {
        return this.owner ? this.owner.has<T>(base, this.ownerIndex) : null
    }

    private add<T extends Task>(value: T) {
        const constructor = value.constructor
        this.ensure(constructor);
        // Singleton enforcement...
        //if (this.has(constructor)) {
        //  throw new Error(`${constructor.name} already exists within task ${this.constructor.name}`);
        //}

        this.components.push(value);
    }

    public async initialize(...args: any[]) {
        void args;
        for (const component of this.components) {
            await component.initialize(...component.dependencies)
        }
    }

    public process() {
    }
}
