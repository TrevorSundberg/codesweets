import * as git from "isomorphic-git";
import {Directory, DirectoryData} from "../file/file";
import {TaskMeta} from "../sweet/sweet";

export interface GitRepositoryData extends DirectoryData {
  url: string;
  username?: string;
  password_or_token?: string;
}

export class GitRepository extends Directory<GitRepositoryData> {
  public static meta: TaskMeta = new TaskMeta({
    construct: GitRepository,
    outputs: [Directory],
    schema: require("ts-schema!./git-repository.ts?GitRepositoryData"),
    typename: "GitRepository"
  })

  public git = git

  public get args () {
    return {
      corsProxy: "https://cors.isomorphic-git.org",
      dir: this.data.directory,
      emitter: this,
      fs: this.fs,
      password: this.data.password_or_token,
      url: this.data.url,
      username: this.data.username
    };
  }

  protected async onInitialize () {
    this.on("message", this.log);
  }
}
