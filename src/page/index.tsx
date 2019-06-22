import * as React from "react";
import * as ReactDOM from "react-dom";
import Form from "react-jsonschema-form";
import {Hello} from "./components/hello";
import {JSONSchema6} from "json-schema";

type TaskMeta = import("../sweet/sweet").TaskMeta

ReactDOM.render(
  <Hello compiler="TypeScript" framework="React" />,
  document.getElementById("example")
);

// eslint-disable-next-line no-eval
const loadJS = (url: string): Promise<any> => eval(`import(${JSON.stringify(url)})`);

const log = (type: any) => console.log.bind(console, type);


const taskNames: string[] = [];
const taskSchemas: JSONSchema6[] = [];

const schema: JSONSchema6 = {
  definitions: {},
  properties: {
    components: {
      items: {
        dependencies: {
          typename: {
            oneOf: taskSchemas
          }
        },
        properties: {
          typename: {
            enum: taskNames,
            title: "Task",
            type: "string"
          }
        },
        required: ["typename"],
        type: "object"
      },
      title: "Tasks",
      type: "array"
    }
  },
  type: "object"
};

const globals: any = window || global;
globals.ontaskmeta = (meta: TaskMeta) => {
  if (meta.hidden) {
    return;
  }
  schema.definitions[meta.typename] = meta.schema;
  taskNames.push(meta.typename);
  const componentSchema: JSONSchema6 = {
    properties: {
      data: meta.schema,
      typename: {
        enum: [meta.typename]
      }
    }
  };
  taskSchemas.push(componentSchema);

  console.log(meta.typename, JSON.stringify(meta.schema));
};

loadJS("/bin/tasks/github/github.js").then(() => {
  console.log(JSON.stringify(schema));
  ReactDOM.render(
    <Form schema={schema}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")} />
    , document.getElementById("app")
  );
});

