import FileSystem from "./file-system";
import TaskMeta from "../core/task-meta";

interface GitRepositoryData {
  clone_url: string;
  username?: string;
  password_or_token?: string;
}

export default class GitRepository extends FileSystem<GitRepositoryData> {
  public static meta = new TaskMeta({
    construct: GitRepository,
    outputs: [FileSystem],
    tsFile: __filename
  })
}
