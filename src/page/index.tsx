import * as React from "react";
import * as ReactDOM from "react-dom";
import Form from "react-jsonschema-form";

import {Hello} from "./components/hello";

ReactDOM.render(
  <Hello compiler="TypeScript" framework="React" />,
  document.getElementById("example")
);

const schema = {
  properties: {
    done: {
      default: false,
      title: "Done?",
      type: "boolean"
    },
    title: {
      default: "A new task",
      title: "Title",
      type: "string"
    }
  },
  required: ["title"],
  title: "Todo",
  type: "object"
};

const log = (type: any) => console.log.bind(console, type);

ReactDOM.render(
  <Form schema={schema as any}
    onChange={log("changed")}
    onSubmit={log("submitted")}
    onError={log("errors")} />
  , document.getElementById("app")
);
