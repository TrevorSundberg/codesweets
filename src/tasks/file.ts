import TaskMeta from "../core/task-meta";
import TaskWithData from "../core/task-with-data";
import FileSystem from "./file-system";

interface FileOperation {
  operation: "prepend" | "append" | "replace";
  content?: string;

  /** @default utf8 */
  encoding?: BufferEncoding;
  find_regex?: string;
}

interface FileData {
  path: string;
  operations?: FileOperation[];
}

export default class File extends TaskWithData<FileData> {

  public static meta = new TaskMeta({
    "construct": File,
    "inputs": [FileSystem],
    "tsFile": __filename
  })

}
