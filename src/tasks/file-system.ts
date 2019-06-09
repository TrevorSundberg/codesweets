import TaskWithData from "../core/task-with-data";

export default abstract class FileSystem<T> extends TaskWithData<T> {
  public directory = "/"
}
