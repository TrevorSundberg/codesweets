import Octokit from "@octokit/rest";
import TaskMeta from "../core/task-meta";
import TaskWithData from "../core/task-with-data";

interface GitHubAuthorizationData {
  username: string;
  password_or_token: string;
}

export default class GitHubAuthorization extends TaskWithData<GitHubAuthorizationData> {
  public static meta = new TaskMeta({
    construct: GitHubAuthorization,
    tsFile: __filename
  })

  public octokit: Octokit

  protected async onInitialize () {
    this.octokit = new Octokit({
      auth: {
        on2fa: () => {
          throw new Error("Two factor authentication is not yet supported");
        },
        password: this.data.password_or_token,
        username: this.data.username
      }
    });
  }
}
