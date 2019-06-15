import Ajv from "ajv";
import {JSONSchema6} from "json-schema";

const ajv = new Ajv();

export interface TaskMetaInit {
  construct: Function;
  schema? : JSONSchema6;
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
