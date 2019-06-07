//import Task from './task'
import TaskMeta from './task-meta'

// interfaces
// dependencies

// enumerate possibilities for an interface

// I think all should be possible, but if we create an interface we then put a chooser in its place instead
// Or if multiple are possible (bascially a base class, same thing)

// Then we need to write replace code (which replacements are possible)
// Easiest possible interface right now is to make it so we can add the abstract class anyways
// Not great, but it will make it so we can move forward quickly / do replacement UI instead



export default class TaskDatabase {
    private metas: TaskMeta[] = [];

    //public enumerateAdd(task: Task): TaskMeta[] {
    //    for (const meta of this.metas) {
    //  
    //    }
    //    return null
    //}
}
