import * as React from "react";
import * as ReactDOM from "react-dom";
import Form from "react-jsonschema-form";
import {Hello} from "./components/hello";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const GitHub = require("../../bin/tasks/github").default;

ReactDOM.render(
  <Hello compiler="TypeScript" framework="React" />,
  document.getElementById("example")
);

const log = (type: any) => console.log.bind(console, type);

ReactDOM.render(
  <Form schema={GitHub.GitHubCreateRepository.meta.schema}
    onChange={log("changed")}
    onSubmit={log("submitted")}
    onError={log("errors")} />
  , document.getElementById("app")
);
