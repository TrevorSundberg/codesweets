import {TaskMeta, TaskWithData} from "../sweet/sweet";
import Octokit from "@octokit/rest";

export interface GitHubAuthorizationData {
  username: string;
  password_or_token: string;
}

export class GitHubAuthorization extends TaskWithData<GitHubAuthorizationData> {
  public static meta: TaskMeta = new TaskMeta({
    construct: GitHubAuthorization,
    schema: require("ts-schema!./github-authorization.ts?GitHubAuthorizationData"),
    typename: "GitHubAuthorization"
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
