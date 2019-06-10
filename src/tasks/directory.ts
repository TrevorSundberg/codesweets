import Task from "../core/task";
import TaskWithData from "../core/task-with-data";
import assert from "assert";
import path from "path";

export interface DirectoryData {

  /** @default "/" */
  directory: string;
}

export default abstract class Directory<T extends DirectoryData = DirectoryData> extends TaskWithData<T> {
  public static getWorkingDirectory (task: Task) {
    const dir = task.findAbove<Directory>(Directory);
    const workingDir = dir ? path.resolve("/", dir.data.directory) : "/";
    assert(path.isAbsolute(workingDir));
    return workingDir;
  }

  public static resolve (task: Task, filePath: string) {
    return path.resolve(Directory.getWorkingDirectory(task), filePath);
  }
}
