import {TaskMeta, TaskWithData} from "../sweet/sweet";
import {GitRepository} from "./git-repository";

export interface GitAddData {

  /** @default: '.' */
  add_path: string;
}

export class GitAdd extends TaskWithData<GitAddData> {
  public static meta = new TaskMeta({
    construct: GitAdd,
    inputs: [GitRepository],
    schema: require("ts-schema!./git-add.ts?GitAddData")
  })

  protected async onInitialize (repo: GitRepository) {
    await repo.git.add({...repo.args, filepath: this.data.add_path});
  }
}
