import * as TJS from "typescript-json-schema";
import Ajv from "ajv";
import {JSONSchema6} from "json-schema";
import titleCase from "title-case";
import traverse from "traverse";

const ajv = new Ajv();

interface TypeScriptType {
  __filename: string;
  typeName: string;
}

const settings: TJS.PartialArgs = {
  excludePrivate: true,
  ignoreErrors: true,
  required: true,
  titles: true
};

interface TaskMetaInit {
  construct: Function;
  schema? : JSONSchema6;
  tsFile? : string;
  schemaTransform?: (schema: JSONSchema6) => void;
  uiSchema? : Record<string, any>;
  inputs? : Function[];
  outputs? : Function[];
}

export default class TaskMeta {
  public readonly construct: Function;
  public readonly schema: JSONSchema6;
  public readonly uiSchema: any;
  public readonly inputs: Function[] = [];
  public readonly outputs: Function[] = [];
  public readonly validate: (data: any) => string | null;
  public constructor (init: TaskMetaInit) {
    this.construct = init.construct;
    if (!init.construct) {
      throw new Error("Parameter 'construct' is required and must " +
        "be the constructor for the class it represents");
    }
    if (init.schema) {
      this.schema = init.schema;
    } else if (init.tsFile) {
      let {tsFile} = init;
      if (tsFile.endsWith(".js")) {
        tsFile = tsFile.replace(".js", ".ts").replace("/bin/", "/");
      }
      const program = TJS.getProgramFromFiles([tsFile]);
      const schema = TJS.generateSchema(program, `${this.construct.name}Data`, settings) as JSONSchema6;
      traverse(schema).forEach((node) => {
        if (node.title) {
          node.title = titleCase(node.title);
        }
      });
      this.schema = schema;
    } else {
      this.schema = {};
    }

    if (init.schemaTransform) {
      init.schemaTransform(this.schema);
    }

    this.uiSchema = init.uiSchema || {};
    this.inputs = init.inputs || [];
    this.outputs = init.outputs || [];
    const ajvValidate = ajv.compile(this.schema);
    this.validate = (data) => ajvValidate(data) ? null : ajv.errorsText(ajvValidate.errors);
  }
}
