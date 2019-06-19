import Ajv from "ajv";
import {JSONSchema6} from "json-schema";

const ajv = new Ajv();

export type TaskConstructor = Function & { meta: TaskMeta }

export interface TaskMetaInit {
  typename: string;
  construct: TaskConstructor;
  schema? : JSONSchema6;
  schemaTransform?: (schema: JSONSchema6) => void;
  uiSchema? : Record<string, any>;
  inputs? : TaskConstructor[];
  outputs? : TaskConstructor[];
}

export class TaskMeta {
  public readonly typename: string;

  public readonly construct: TaskConstructor;

  public readonly schema: JSONSchema6;

  public readonly uiSchema: any;

  public readonly inputs: TaskConstructor[] = [];

  public readonly outputs: TaskConstructor[] = [];

  public readonly validate: (data: any) => string | null;

  public constructor (init: TaskMetaInit) {
    this.typename = init.typename;
    this.construct = init.construct;
    if (!init.construct) {
      throw new Error("Parameter 'construct' is required and must " +
        "be the constructor for the class it represents");
    }
    this.schema = init.schema || {};

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
