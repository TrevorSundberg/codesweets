import * as git from "isomorphic-git";
import Directory, {DirectoryData} from "./directory";
import TaskMeta from "../core/task-meta";

interface GitRepositoryData extends DirectoryData {
  url: string;
  username?: string;
  password_or_token?: string;
}

export default class GitRepository extends Directory<GitRepositoryData> {
  public static meta = new TaskMeta({
    construct: GitRepository,
    outputs: [Directory],
    tsFile: __filename
  })
  public git = git
  public get args () {
    return {
      dir: this.data.directory,
      fs: this.fs,
      password: this.data.password_or_token,
      url: this.data.url,
      username: this.data.username
    };
  }
}
