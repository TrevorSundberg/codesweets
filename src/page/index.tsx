import * as React from "react";
import * as ReactDOM from "react-dom";
import Form from "react-jsonschema-form";
import {Hello} from "./components/hello";
import {JSONSchema6} from "json-schema";

ReactDOM.render(
  <Hello compiler="TypeScript" framework="React" />,
  document.getElementById("example")
);

// eslint-disable-next-line no-eval
const loadJS = (url: string): Promise<any> => eval(`import(${JSON.stringify(url)})`);

const log = (type: any) => console.log.bind(console, type);

loadJS("/bin/tasks/github/github.js").then((GitHub) => {
  const typeNames: string[] = [];
  const oneOf: JSONSchema6[] = [];

  const schema: JSONSchema6 = {
    definitions: {},
    properties: {
      components: {
        items: {
          dependencies: {
            typename: {
              oneOf
            }
          },
          properties: {
            typename: {
              enum: typeNames,
              type: "string"
            }
          },
          required: ["typename"],
          type: "object"
        },
        type: "array"
      }
    },
    type: "object"
  };

  // eslint-disable-next-line guard-for-in
  for (const prop in GitHub.default) {
    const value = GitHub.default[prop];
    if (value && typeof value.meta === "object" && value.meta.typename) {
      schema.definitions[value.meta.typename] = value.meta.schema;
      typeNames.push(value.meta.typename);

      const componentSchema: JSONSchema6 = {
        properties: {
          data: value.meta.schema,
          typename: {
            enum: [value.meta.typename]
          }
        }
      };
      oneOf.push(componentSchema);

      console.log(value.meta.typename);
    }
  }
  console.log(JSON.stringify(schema));
  ReactDOM.render(
    <Form schema={schema}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")} />
    , document.getElementById("app")
  );
});

