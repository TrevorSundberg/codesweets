import * as React from "react";
import * as ReactDOM from "react-dom";
import Form from "react-jsonschema-form";
import {Hello} from "./components/hello";

ReactDOM.render(
  <Hello compiler="TypeScript" framework="React" />,
  document.getElementById("example")
);

// eslint-disable-next-line no-eval
const loadJS = (url: string): Promise<any> => eval(`import(${JSON.stringify(url)})`);

const log = (type: any) => console.log.bind(console, type);

loadJS("/bin/tasks/github/github.js").then((GitHub) => {
  ReactDOM.render(
    <Form schema={GitHub.default.GitHubCreateRepository.meta.schema}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")} />
    , document.getElementById("app")
  );
});

