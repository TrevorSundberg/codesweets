import Directory from "./directory";
import {FLAGS} from "memfs/lib/volume";
import TaskMeta from "../core/task-meta";
import TaskWithData from "../core/task-with-data";

export type FileCreateEncoding = "utf8" | "ascii" | "base64" | "hex"

export interface FileCreateData {
  path: string;
  content: string;
  flag?: FLAGS;
  mode?: number;

  /** @default utf8 */
  encoding: FileCreateEncoding;
}

export default class FileCreate extends TaskWithData<FileCreateData> {
  public static meta = new TaskMeta({
    construct: FileCreate,
    inputs: [],
    tsFile: __filename
  })

  protected async onInitialize () {
    const path = Directory.resolve(this, this.data.path);
    const buffer = Buffer.from(this.data.content, this.data.encoding);
    await this.fs.promises.writeFile(path, buffer, {
      encoding: "binary",
      flag: this.data.flag || "w"
    });
  }
}
