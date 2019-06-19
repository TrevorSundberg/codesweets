import {TaskMeta, TaskWithData} from "../sweet/sweet";
import {Directory} from "./directory";

export declare enum FileFlags {
  r,
  "r+",
  rs,
  sr,
  "rs+",
  "sr+",
  w,
  wx,
  xw,
  "w+",
  "wx+",
  "xw+",
  a,
  ax,
  xa,
  "a+",
  "ax+",
  "xa+"
}

export type FileCreateEncoding = "utf8" | "ascii" | "base64" | "hex"

export interface FileCreateData {
  path: string;
  content: string;
  flag?: FileFlags;
  mode?: number;

  /** @default utf8 */
  encoding: FileCreateEncoding;
}

export class FileCreate extends TaskWithData<FileCreateData> {
  public static meta = new TaskMeta({
    construct: FileCreate,
    inputs: [],
    schema: require("ts-schema!./file-create.ts?FileCreateData")
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
