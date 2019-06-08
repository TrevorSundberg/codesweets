import TaskWithData from "../core/task-with-data";

process.env.MEMFS_DONT_WARN = true as unknown as string;
import {Volume} from "memfs";

export default abstract class FileSystem<T> extends TaskWithData<T> {
  public readonly fs = new Volume();
}
