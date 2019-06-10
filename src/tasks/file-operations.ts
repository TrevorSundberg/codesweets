import Directory from "./directory";
import TaskMeta from "../core/task-meta";
import TaskWithData from "../core/task-with-data";

interface FileOperation {
  operation: "prepend" | "append" | "overwrite";
  content?: string;

  /** @default utf8 */
  encoding?: BufferEncoding;
  find_regex?: string;
}

interface FileOperationsData {
  path: string;
  operations?: FileOperation[];
}

export default class FileOperations extends TaskWithData<FileOperationsData> {
  public static meta = new TaskMeta({
    construct: FileOperations,
    inputs: [],
    tsFile: __filename
  })

  protected async onInitialize () {
    const path = Directory.resolve(this, this.data.path);
    let buffer: Buffer = null;
    try {
      buffer = (await this.fs.promises.readFile(path)) as Buffer;
    } catch {
      buffer = Buffer.alloc(0);
    }

    for (const op of this.data.operations) {
      const content = Buffer.from(op.content, op.encoding);
      // /const findRegex = Buffer.from(op.find_regex, op.encoding);
      switch (op.operation) {
        case "prepend": {
          buffer = Buffer.concat([
            content,
            buffer
          ]);
          break;
        }
        case "append": {
          buffer = Buffer.concat([
            buffer,
            content
          ]);
          break;
        }
        case "overwrite": {
          break;
        }
      }
    }
  }
}
