import {JSONSchema6} from "json-schema";
import Octokit from "@octokit/rest";
import TaskMeta from "../core/task-meta";
import TaskWithData from "../core/task-with-data";

type GitHubAuthorizationData =
  { username: string; password: string } |
  { token: string } |
  { clientId: string; clientSecret: string }

export default class GitHubAuthorization extends TaskWithData<GitHubAuthorizationData> {
  public static meta = new TaskMeta({
    construct: GitHubAuthorization,
    schemaTransform: (schema) => {
      (schema.anyOf[0] as JSONSchema6).title = "Login";
      (schema.anyOf[1] as JSONSchema6).title = "Token";
      (schema.anyOf[2] as JSONSchema6).title = "Client Secret";
    },
    tsFile: __filename
  })
  public octokit: Octokit
  protected async initialize () {
    const data = this.data as any;
    data.on2fa = () => {
      throw new Error("Two factor authentication is not yet supported");
    };

    this.octokit = new Octokit({
      auth: data.token || data
    });
  }
}
