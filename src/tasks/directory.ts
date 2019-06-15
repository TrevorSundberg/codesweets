import {Task, TaskMeta, TaskWithData} from "../core/sweet";
import assert from "assert";
import path from "path";

export interface DirectoryData {

  /** @default "/" */
  directory: string;
}

export default abstract class Directory<T extends DirectoryData = DirectoryData> extends TaskWithData<T> {
  public static meta = new TaskMeta({
    construct: Directory,
    inputs: [],
    schema: require("ts-schema!./directory.ts?DirectoryData")
  })

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
